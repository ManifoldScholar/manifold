# frozen_string_literal: true

module Projects
  class ReindexResourcesJob < ApplicationJob
    include JobIteration::Iteration

    queue_as :low_priority

    # @param [Project] project
    # @param [String, nil] cursor
    # @return [Enumerator<#update_pg_search_document>]
    def build_enumerator(project, cursor:)
      enumerator_builder.active_record_on_records(
        project.resources.reload.reorder(nil).all,
        cursor:,
      )
    end

    # @param [#update_pg_search_document] record
    def each_iteration(record, _project)
      record.reload.update_pg_search_document
    end
  end
end
