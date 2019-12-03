module Packaging
  module EpubV3
    module BookCompilation
      class AddIngestionSources
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            compiled_text.ingestion_sources.each do |ingestion_source|
              item = book.add_item ingestion_source.path

              item.add_content ingestion_source.to_io

              item.set_media_type ingestion_source.content_type
            end
          end
        end
      end
    end
  end
end
