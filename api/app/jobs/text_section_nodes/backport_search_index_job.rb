# frozen_string_literal: true

module TextSectionNodes
  class BackportSearchIndexJob < ApplicationJob
    include JobIteration::Iteration

    queue_as :low_priority

    unique :until_executed, lock_ttl: 2.days, on_conflict: :log

    def build_enumerator(cursor:)
      enumerator_builder.active_record_on_records(
        TextSectionNode.sans_search_indexed,
        cursor:
      )
    end

    # @param [TextSectionNode] text_section_node
    # @return [void]
    def each_iteration(text_section_node)
      text_section_node.index_contained_content!
    end
  end
end
