module Packaging
  module EpubV3
    # A proxy object that wraps a {Text} and its dependent resources which have
    # also been proxied, so as to provide a uniform interface to export an epub.
    #
    # Produced via {Packaging::EpubV3::TextCompilation::Pipeline}.
    class CompiledText < Types::FlexibleStruct
      include Dry::Equalizer.new(:text_id)

      attribute :collaborators, Types::Array.of(Packaging::EpubV3::CollaboratorItem)
      attribute :fingerprint, Types::String
      attribute :ingestion_sources, Types::Array.of(Packaging::EpubV3::IngestionSourceItem)
      attribute :namespace_set, HTMLNodes::NamespaceSet
      attribute :package_context, Types.Instance(Packaging::EpubV3::PackageContext)
      attribute :referenced_items, Types::Array.of(Packaging::EpubV3::GroupedReferencedItem)
      attribute :remote_resources, Types::Array.of(Packaging::EpubV3::RemoteResourceItem)
      attribute :stylesheets, Types::Array.of(Packaging::EpubV3::StylesheetItem)
      attribute :text, Types.Instance(::Text)
      attribute :text_sections, Types::Array.of(Packaging::EpubV3::TextSectionItem)
      attribute :titles, Types::Array.of(Packaging::EpubV3::TitleItem)

      delegate :id, to: :text, prefix: true

      # @!attribute [r] book_id
      # @return [String]
      memoize def book_id
        "manifold-#{text_id}"
      end

      def has_language?
        language.present?
      end

      # @!attribute [r] language
      # @return [String]
      def language
        text.language_plaintext
      end

      # @!attribute [r] primary_identifier
      # @return [(String, String, String)]
      memoize def primary_identifier
        [reader_url, book_id, "URL"]
      end

      # @!attribute [r] reader_url
      # @return [String]
      memoize def reader_url
        URI.join(Packaging::EpubV3::Container["frontend_url"], "/read/#{text_id}").to_s
      end
    end
  end
end
