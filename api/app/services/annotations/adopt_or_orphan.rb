# This service attempts to reassign an annotation's start/end positions based on
# subject content. To keep things sane, we only assume a node is correct
# if a block of its content is is an exact match to a piece of the subject.
module Annotations
  class AdoptOrOrphan < ActiveInteraction::Base
    object :annotation

    def execute
      candidates = determine_parent_candidates

      return annotation if valid_parents? current_parents

      if valid_parents? candidates
        adopt_annotation candidates
      else
        orphan_annotation
      end

      annotation.save
      annotation
    end

    private

    def orphan_annotation
      annotation.assign_attributes orphaned: true
    end

    def adopt_annotation(candidates)
      annotation.assign_attributes candidates.merge(orphaned: false)
    end

    # A set of nodes is only considered valid if all are present and
    # the content spanning the nodes contains an exact match to the
    # annotation subject.
    def valid_parents?(candidates)
      candidates_present?(candidates) && valid_content?(candidates)
    end

    # We only consider this a success if everything has been matched
    def candidates_present?(candidates)
      candidates.values.all?(&:present?)
    end

    # We compile the content from the start node to the end node and
    # see if the complete subject is included.  If not, we consider
    # this annotation changed and orphan it.
    def valid_content?(candidates)
      start_node, end_node = candidates.values
      node_range = annotation.text_section.text_node_range start_node, end_node
      content = node_range.map { |n| n[:content] }.join
      content.include? annotation.subject
    end

    def current_parents
      {
        start_node: annotation.start_node,
        end_node: annotation.end_node,
        start_char: annotation.start_char,
        end_char: annotation.end_char
      }
    end

    # Here we create an array of letters for every node's content.  For every
    # letter we look forward to the content end and backwards from the content
    # end to the letter.  We then try to match those chunks to either the start
    # or end of the subject.
    #
    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def determine_parent_candidates
      candidates = {
        start_node: nil,
        end_node: nil,
        start_char: nil,
        end_char: nil
      }.with_indifferent_access

      # We have to check every text section in case there are multiple matches, so
      # we can't abort out of this early.
      # If we have multiple matches for any node, we cannot assume that either is the
      # correct one and therefore abort and orphan the annotation.
      annotation.text_section_text_nodes.each do |node|
        content = node[:content]
        content.split(//).each_with_index do |_letter, index|
          from_start = content[index..content.length - 1]
          from_end = content[0..index]

          if annotation.subject.start_with? from_start
            return {} if candidates[:start_node].present?
            candidates[:start_node] = node[:node_uuid]
            candidates[:start_char] = index + 1
          elsif annotation.subject.end_with? from_end
            return {} if candidates[:end_node].present?
            candidates[:end_node] = node[:node_uuid]
            candidates[:end_char] = index
          end
        end
      end

      candidates
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
  end
end
