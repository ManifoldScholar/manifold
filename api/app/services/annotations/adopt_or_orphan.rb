module Annotations
  # This service attempts to reassign an annotation's start/end positions based on
  # subject content. To keep things sane, we only assume a node is correct
  # if a block of its content is is an exact match to a piece of the subject.
  class AdoptOrOrphan < ActiveInteraction::Base

    extend Memoist

    record :annotation
    delegate :text_section, to: :annotation
    delegate :text_nodes, to: :text_section

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def execute
      return orphan_annotation unless adoptable?

      updates = update_hash

      haystack_iterator = 0
      text_nodes.each do |node|
        node_text_iterator = 0
        node_content = collapse(node[:content])
        node_content.split("") do
          if haystack_iterator == start_index
            updates[:start_node] = node[:node_uuid]
            updates[:start_char] = node_text_iterator + 1
          elsif haystack_iterator == final_index
            updates[:end_node] = node[:node_uuid]
            updates[:end_char] = node_text_iterator
          end
          haystack_iterator += 1
          node_text_iterator += 1
        end
      end

      return orphan_annotation unless all_present? updates

      adopt_annotation(updates)
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

    private

    def adoptable?
      return false if multiple_occurrences?
      return false unless start_index.present? && final_index.present?

      true
    end

    def update_hash
      {
        start_node: nil,
        end_node: nil,
        start_char: nil,
        end_char: nil
      }
    end

    def all_present?(hash)
      hash.values.all?
    end

    def collapse(input)
      input.gsub(/[[:space:]]+/, " ")
    end

    def needle
      collapse(annotation.subject)
    end

    memoize def start_index
      haystack.index(/#{needle_query}/i)
    end

    memoize def final_index
      start_index + needle.size - 1
    end

    memoize def occurrences
      haystack.scan(/#{needle_query}/i)
    end

    def multiple_occurrences?
      occurrences.length > 1
    end

    def needle_query
      needle.split(/[[:space:]]+/).map { |w| Regexp.quote(w) }.join("[[:space:]]+")
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
