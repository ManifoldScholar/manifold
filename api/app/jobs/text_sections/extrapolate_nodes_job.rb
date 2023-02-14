# frozen_string_literal: true

module TextSections
  # @see TextSections::ExtrapolateNodes
  class ExtrapolateNodesJob < ApplicationJob
    queue_as :default

    discard_on ActiveJob::DeserializationError, ActiveRecord::RecordNotFound

    # @param [TextSection] text_section
    # @return [void]
    def perform(text_section)
      ManifoldApi::Container["text_sections.extrapolate_nodes"].(text_section: text_section).value!
    end
  end
end
