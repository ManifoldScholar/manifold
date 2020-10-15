module Packaging
  module EpubV3
    # Proxies an {IngestionSource} for Epub export.
    class IngestionSourceItem < Types::FlexibleStruct
      include Dry::Equalizer.new(:ingestion_source_id)
      include Dux.comparable(:manifold_path)
      include Packaging::EpubV3::HasPath

      attribute :ingestion_source, Types.Instance(::IngestionSource)

      delegate :id, to: :ingestion_source, prefix: true
      delegate *IngestionSourceKind.predicates, :content_type, :kind, :text, :source_path, to: :ingestion_source
      delegate :source_path_map, to: :text

      # @!attribute [r] manifold_path
      # @return [String]
      memoize def manifold_path
        source_path_map.fetch(source_path)
      end

      # @return [File]
      def to_io
        if ingestion_source.attachment.storage.respond_to? :path
          ingestion_source.attachment.to_io
        else
          Down.download(ingestion_source.attachment.url)
        end
      end

      private

      def build_base_path
        File.join("assets", File.basename(source_path))
      end
    end
  end
end
