# frozen_string_literal: true

module Annotations
  # This service attempts to reassign an annotation's start/end positions based on
  # subject content. To keep things sane, we only assume a node is correct
  # if a block of its content is is an exact match to a piece of the subject.
  # rubocop:disable Metrics/AbcSize
  class AdoptOrOrphan < ActiveInteraction::Base
    extend Memoist

    # The maximum amount of time (elapsed) this service can run, per annotation.
    # Each iteration is checked.
    MAX_EXECUTION_TIME = 60.seconds

    record :annotation

    delegate :text_section, to: :annotation

    # @return [Boolean]
    attr_reader :adoptable

    alias adoptable? adoptable

    # @return [Annotations::AdoptionAssignment]
    attr_reader :adoption_assignment

    # @return [Integer]
    attr_reader :final_index

    # @return [String]
    attr_reader :haystack

    # @return [Boolean]
    attr_reader :multiple_occurrences

    # @return [String]
    attr_reader :needle

    # @return [<String>]
    attr_reader :occurrences

    # @return [Integer]
    attr_reader :start_index

    # @return [ActiveSupport::TimeWithZone]
    attr_reader :started_at

    # @return [<Hash>]
    attr_reader :text_nodes

    alias multiple_occurrences? multiple_occurrences

    # @return [Annotation]
    def execute
      prepare!

      derive_facts!

      return orphan_annotation! unless adoptable?

      derive_possible_adoption!

      return orphan_annotation! unless adoption_assignment.valid?

      if adoption_assignment.valid?
        adoption_assignment.adopt! annotation
      else
        orphan_annotation!
      end
    rescue HaltError
      # :nocov:
      orphan_annotation!
      # :nocov:
    end

    private

    # @!group Steps

    # @return [void]
    def prepare!
      @text_nodes = text_section.text_nodes
      @needle = collapse(annotation.subject)

      @haystack = collapse(text_nodes.pluck(:content).join)

      pattern = /#{Regexp.escape(needle)}/i

      @start_index = haystack.index pattern
      @final_index = start_index + needle.size - 1 if start_index
      @occurrences = haystack.scan pattern

      @started_at = Time.current
    end

    # @return [void]
    def derive_facts!
      @multiple_occurrences = @occurrences.many?
      @adoptable = start_index.present? && final_index.present?
    end

    # @return [void]
    def derive_possible_adoption!
      # iterate through the haystack with all whitespace collapsed to assign start and end nodes
      # if the needle has more than one match, attempt to locate it by node uuids
      node_updates =
        if multiple_occurrences?
          maybe_locate_occurrence
        else
          find_needle_in_haystack(text_nodes, start_index, final_index)
        end

      # iterate through the text content of the new nodes accounting for whitespace to find the correct start and end chars
      char_updates = place_subject_in_nodes(node_updates)

      @adoption_assignment = Annotations::AdoptionAssignment.new(**node_updates, **char_updates)
    end

    # @!endgroup

    # @param [<Hash>] node_subset
    # @param [Integer] first_index
    # @param [Integer] last_index
    # @return [Hash]
    def find_needle_in_haystack(node_subset, first_index, last_index)
      updates = {
        start_node: nil,
        end_node: nil,
      }

      haystack_iterator = 0

      node_subset.each do |node|
        node_text_iterator = 0
        node_content = collapse(node[:content])
        node_content.chars do
          if haystack_iterator == first_index
            updates[:start_node] = node[:node_uuid]
          elsif haystack_iterator == last_index
            updates[:end_node] = node[:node_uuid]
          end
          haystack_iterator += 1
          node_text_iterator += 1
        end
      ensure
        check_execution_time!
      end

      updates
    end

    def maybe_locate_occurrence
      start_node = text_nodes.find { |node| node[:node_uuid] == annotation.start_node }

      unless start_node
        return {
          start_node: nil,
          end_node: nil
        }
      end

      if annotation.start_node == annotation.end_node
        return {
          start_node: annotation.start_node,
          end_node: annotation.end_node
        }
      else
        start_node_index = text_nodes.index { |node| node[:node_uuid] == annotation.start_node }
        end_node_index = text_nodes.index { |node| node[:node_uuid] == annotation.end_node }

        unless end_node_index
          return {
            start_node: nil,
            end_node: nil
          }
        end

        node_subset = text_nodes[start_node_index..end_node_index]
        first_index = annotation.start_char - 1
        last_index = first_index + needle.size - 1

        find_needle_in_haystack(node_subset, first_index, last_index)
      end
    end

    # @param [Hash] nodes
    # @option nodes [String] :start_node
    # @option nodes [String] :end_node
    def place_subject_in_nodes(nodes)
      start = text_nodes.find { |node| node[:node_uuid] == nodes[:start_node] }
      final = text_nodes.find { |node| node[:node_uuid] == nodes[:end_node] }

      unless start && final
        return {
          start_char: nil,
          end_char: nil
        }
      end

      start_index = place_in_node(node: start)
      last_index = place_in_node(node: final, end_node: true)

      {
        start_char: start_index ? start_index + 1 : nil,
        end_char: last_index ? last_index + 1 : nil
      }
    end

    # @param [Hash] node
    # @param [Boolean] end_node
    # @see #find_substr_index
    # @return [Integer]
    def place_in_node(node:, end_node: false)
      # split subject into chars ignoring whitespace
      # escape regex metachars so they match
      splits = annotation.subject.split(/\s*/).map { |c| Regexp.escape(c) }
      splits.reverse! if end_node

      text_content = node[:content]

      node_occurrences = text_content.scan(/#{splits[0]}/i)

      # if we can't find the first char, something went wrong; shouldn't happen
      return nil if node_occurrences.blank?
      # if the first char is unique in the node, return its index
      return text_content.index(splits[0]) if node_occurrences.one?

      # if it occurs more than once, iteratively expand the search
      find_substr_index(splits: splits, text_content: text_content, count: 1, from_end: end_node)
    end

    # iterate by character until we find the shortest unique substr at the start or end of the subject in the respective node
    # return the index of that substr in the node text content
    #
    # @param [<String>] splits array of characters to search for
    # @param [String] text_content node content to search for the substr within
    # @param [Integer] count recursion count for finding the unique occurrence within
    # @param [Boolean] from_end whether this should start looking from the end of the textual content / `splits`.
    # @param [Regexp] prev_substr the pattern for the previous iteration (@see #substr_regex)
    # @raise [Annotations::AdoptOrOrphan::TooManyCandidates]
    # @return [Integer]
    def find_substr_index(
      splits:, text_content:,
      count: 1, from_end: false,
      prev_substr: substr_regex(splits: splits, count: count - 1, from_end: from_end)
    )
      max_count = splits.length + 2

      raise TooManyCandidates, "max_count attempts exceeded: #{count}" if count > max_count

      check_execution_time!

      substr = substr_regex(splits: splits, count: count, from_end: from_end)

      node_occurrences = text_content.scan(substr)

      if from_end
        # if we don't find a match, we want the first occurrence of the previous search term
        # use the match data to find the length of the substr in the text node in case the client added or removed whitespace
        return text_content.index(prev_substr) + prev_substr.match(text_content)[0].length - 1 if node_occurrences.empty?
        return text_content.index(substr) + substr.match(text_content)[0].length - 1 if node_occurrences.one?
      else
        # if we don't find a match, we want the last occurrence of the previous search term
        return text_content.rindex(prev_substr) if node_occurrences.empty?
        return text_content.index(substr) if node_occurrences.one?
      end

      # Recur with a higher count
      find_substr_index(splits: splits, text_content: text_content, count: count + 1, from_end: from_end, prev_substr: substr)
    end

    # @param [<String>] splits array of characters to search for
    # @param [Integer] count recursion count for finding the unique occurrence within
    # @param [Boolean] from_end whether this should start looking from the end of the textual content / `splits`.
    # @return [Regexp] pattern for use in {#find_substr_index}
    def substr_regex(splits:, count:, from_end: false)
      len = count.to_i.clamp(1..)

      chars = splits.take(len)

      chars.reverse! if from_end

      /#{chars.join("[[:space:]]*")}/i
    end

    # @!group Utility Methods

    # @raise [Annotations::AdoptOrOrphan::ExecutionTimeExceeded]
    # @return [void]
    def check_execution_time!
      raise ExecutionTimeExceeded if elapsed_time > MAX_EXECUTION_TIME
    end

    # @param [String] input
    # @return [String]
    def collapse(input)
      input.gsub(/[[:space:]]+/, "")
    end

    # @return [ActiveSupport::Duration]
    def elapsed_time
      started_at.present? ? Time.current - started_at : 0
    end

    # @return [Annotation]
    def orphan_annotation!
      annotation.update! orphaned: true

      return annotation
    end

    # @param [<String>] prev
    # @param [<String>] curr
    def repeated_occurrences?(prev, curr)
      prev.present? && curr.present? && prev == curr
    end

    # @!endgroup

    # @abstract
    class HaltError < StandardError; end

    # A private error raised when this service has run for too long
    # trying to match things. It will short-circuit and orphan the
    # annotation in such an event.
    class ExecutionTimeExceeded < HaltError; end

    # A private error raised when trying to find the candidate
    # to remap. For very short annotations, or very common phrases,
    # this will bail out instead of infinitely looping.
    class TooManyCandidates < HaltError; end
  end
  # rubocop:enable Metrics/AbcSize
end
