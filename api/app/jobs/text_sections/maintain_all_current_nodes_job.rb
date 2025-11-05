# frozen_string_literal: true

module TextSections
  class MaintainAllCurrentNodesJob < ApplicationJob
    include JobIteration::Iteration

    queue_as :low_priority

    queue_with_priority 500

    # @param [String, nil] cursor
    # @return [Enumerator]
    def build_enumerator(cursor:)
      enumerator_builder.active_record_on_records(
        TextSection.all,
        cursor:,
      )
    end

    # @param [TextSection] text_section
    # @return [void]
    def each_iteration(text_section)
      text_section.maintain_current_nodes!
    end
  end
end
