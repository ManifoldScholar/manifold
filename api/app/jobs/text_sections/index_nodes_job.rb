# frozen_string_literal: true

module TextSections
  # @see TextSections::IndexNodes
  class IndexNodesJob < ApplicationJob
    queue_as :default

    queue_with_priority 100

    # @param [TextSection] text_section
    # @return [void]
    def perform(text_section)
      text_section.index_nodes!
    end
  end
end
