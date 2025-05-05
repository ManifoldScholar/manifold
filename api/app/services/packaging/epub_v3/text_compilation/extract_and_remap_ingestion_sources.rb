# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      # Extract referenced items that correspond to an ingestion source,
      # store a reference to the ingestion source, and modify the HTML nodes
      # that point to the manifold paths to use
      # {Packaging::EpubV3::IngestionSourceItem#remapped_path the internal epub path}.
      class ExtractAndRemapIngestionSources
        include ::Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [<Packaging::EpubV3::GroupedReferencedItem>] :referenced_items
        # @option state [Text] :text
        # @return [void]
        def call
          state[:ingestion_sources] = []

          state[:referenced_items].select(&:has_ingestion_source?).each do |item|
            ingestion_source = item.derived_ingestion_source

            source_item = Packaging::EpubV3::IngestionSourceItem.new ingestion_source: ingestion_source

            state[:ingestion_sources] << source_item

            item.update_references_to! source_item.remapped_path
          end

          Success()
        end
      end
    end
  end
end
