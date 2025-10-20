# frozen_string_literal: true

module TextSections
  # An operation to extrapolate and prune {TextSectionNode}s for a {TextSection}.
  # Because this operation can be very large, we run it in the background,
  # with a separate task to actually index the content for full-text search.
  # @see TextSections::IndexCurrentNodeContentJob
  class IndexNodes
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      extrapolate_nodes: "text_sections.extrapolate_nodes",
      prune_nodes: "text_sections.prune_nodes",
    ]

    # @param [TextSection] text_section
    # @return [Dry::Monads::Result]
    def call(text_section)
      results = yield extrapolate_nodes.(text_section:)

      results => { upserted:, }

      pruned = yield prune_nodes.(text_section)

      text_section.asynchronously_index_current_node_content!

      counts = { upserted:, pruned:, }

      Success counts
    end
  end
end
