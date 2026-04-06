# frozen_string_literal: true

module TextSections
  # A job to index the contained content for all nodes in a {TextSection}.
  #
  # A single text section may have several thousand current nodes and we
  # want to background the indexing of each node rather than handle it
  # all at once in a single request.
  class IndexCurrentNodeContentJob < ApplicationJob
    include JobIteration::Iteration

    queue_as :low_priority

    queue_with_priority 500

    # @param [TextSection] text_section
    # @param [String, nil] cursor
    # @return [Enumerator]
    def build_enumerator(text_section, cursor:)
      enumerator_builder.active_record_on_records(
        text_section.text_section_nodes.current.reorder(nil).all,
        cursor:,
      )
    end

    # @param [TextSectionNode] text_section_node
    # @param [TextSection] _text_section
    # @return [void]
    def each_iteration(text_section_node, _text_section)
      text_section_node.index_contained_content!
    end
  end
end
