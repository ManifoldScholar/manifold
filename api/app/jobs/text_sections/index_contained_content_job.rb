# frozen_string_literal: true

module TextSections
  # @see TextSection#index_contained_content!
  # @see TextSections::IndexContainedContent
  class IndexContainedContentJob < ApplicationJob
    queue_as :low_priority

    # @see TextSection#index_contained_content!
    # @param [TextSection] text_section
    # @return [void]
    def perform(text_section)
      text_section.index_contained_content!
    end
  end
end
