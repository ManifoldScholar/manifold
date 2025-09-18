# frozen_string_literal: true

module TextSectionNodes
  class BackportSearchIndexJob < ApplicationJob
    include JobIteration::Iteration

    queue_as :low_priority

    unique :until_executed, lock_ttl: 2.days, on_conflict: :log

    def build_enumerator(cursor:)
      enumerator_builder.active_record_on_batch_relations(
        TextSectionNode.sans_search_indexed,
        cursor:,
        batch_size: 1000
      )
    end

    # @param [ActiveRecord::Relation<TextSectionNode>] batch_relation
    # @return [void]
    def each_iteration(batch_relation)
      batch_relation.backport_search_index!
    end
  end
end
