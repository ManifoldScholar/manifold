module Annotations
  # This service attempts to reassign an annotation's start/end positions based on
  # subject content. To keep things sane, we only assume a node is correct
  # if a block of its content is is an exact match to a piece of the subject.
  class AdoptOrOrphan < ActiveInteraction::Base

    extend Memoist

    record :annotation
    delegate :text_section, to: :annotation
    delegate :text_nodes, to: :text_section

    def execute
      return orphan_annotation unless adoptable?

      # iterate through the haystack with all whitespace collapsed to assign start and end nodes
      # if the needle has more than one match, attempt to locate it by node uuids
      node_updates = if multiple_occurrences?
                       maybe_locate_occurence
                     else
                       find_needle_in_haystack(text_nodes, start_index, final_index)
                     end

      # iterate through the text content of the new nodes accounting for whitespace to find the correct start and end chars
      char_updates = place_subject_in_nodes(node_updates)

      updates = node_updates.merge(char_updates)

      return orphan_annotation unless all_present? updates

      adopt_annotation(updates)
    end

    private

    # rubocop:disable Metrics/MethodLength
    def find_needle_in_haystack(a_haystack, first_index, last_index)
      updates = {
        start_node: nil,
        end_node: nil,
      }

      haystack_iterator = 0
      a_haystack.each do |node|
        node_text_iterator = 0
        node_content = collapse(node[:content])
        node_content.split("") do
          if haystack_iterator == first_index
            updates[:start_node] = node[:node_uuid]
          elsif haystack_iterator == last_index
            updates[:end_node] = node[:node_uuid]
          end
          haystack_iterator += 1
          node_text_iterator += 1
        end
      end

      updates
    end
    # rubocop:enable Metrics/MethodLength

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def maybe_locate_occurence
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

        haystack = text_nodes[start_node_index..end_node_index]
        first_index = annotation.start_char - 1
        last_index = first_index + needle.size - 1

        find_needle_in_haystack(haystack, first_index, last_index)
      end
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

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

    def place_in_node(node:, end_node: false)
      # split subject into chars ignoring whitespace
      splits = annotation.subject.split(/\s*/)
      splits.reverse! if end_node

      text_content = node[:content]
      node_occurrences = text_content.scan(splits[0])

      # if we can't find the first char, something went wrong; shouldn't happen
      return nil if node_occurrences.size.zero?
      # if the first char is unique in the node, return its index
      return text_content.index(splits[0]) if node_occurrences.size == 1

      # if it occurs more than once, iteratively expand the search
      find_substr_index(splits: splits, text_content: text_content, count: 1, from_end: end_node)
    end

    # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity
    # iterate by character until we find the shortest unique substr at the start or end of the subject in the respective node
    # return the index of that substr in the node text content
    def find_substr_index(splits:, text_content:, count:, from_end: false)
      # escape regex metachars so they match
      splits = splits.map { |c| metachars.include?(c) ? "\\#{c}" : c }
      substr = substr_regex(splits: splits, count: count, from_end: from_end)
      node_occurrences = text_content.scan(substr)

      prev_substr = substr_regex(splits: splits, count: count - 1, from_end: from_end)

      if from_end
        # if we don't find a match, we want the first occurrence of the previous search term
        # use the match data to find the length of the substr in the text node in case the client added or removed whitespace
        return text_content.index(prev_substr) + prev_substr.match(text_content)[0].length - 1 if node_occurrences.size.zero?
        return text_content.index(substr) + substr.match(text_content)[0].length - 1 if node_occurrences.size == 1
      else
        # if we don't find a match, we want the last occurrence of the previous search term
        return text_content.rindex(prev_substr) if node_occurrences.size.zero?
        return text_content.index(substr) if node_occurrences.size == 1
      end

      find_substr_index(splits: splits, text_content: text_content, count: count + 1, from_end: from_end)
    end
    # rubocop:enable Metrics/AbcSize, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity

    def substr_regex(splits:, count:, from_end:)
      i = 0
      substr = /#{splits[0]}/i

      while i < count
        substr = if from_end
                   /#{splits[i + 1]}[[:space:]]*#{substr}/i
                 else
                   /#{substr}[[:space:]]*#{splits[i + 1]}/i
                 end
        i += 1
      end

      substr
    end

    def metachars
      %w[( ) [ ] { } . ? + *]
    end

    def adoptable?
      return false unless start_index.present? && final_index.present?

      true
    end

    def all_present?(hash)
      hash.values.all?
    end

    def collapse(input)
      input.gsub(/[[:space:]]+/, "")
    end

    def needle
      collapse(annotation.subject)
    end

    memoize def start_index
      haystack.index(/#{needle}/i)
    end

    memoize def final_index
      start_index + needle.size - 1
    end

    memoize def occurrences
      haystack.scan(/#{needle}/i)
    end

    def multiple_occurrences?
      occurrences.length > 1
    end

    memoize def haystack
      collapse(text_nodes.map { |node| node[:content] }.join)
    end

    def orphan_annotation
      annotation.assign_attributes orphaned: true
      annotation.save
    end

    def adopt_annotation(candidates)
      annotation.assign_attributes candidates.merge(orphaned: false)
      annotation.save
    end

  end
end
