module Packaging
  module EpubV3
    # Proxy around a {TextSection} and its dependent objects.
    class TextSectionItem < Types::FlexibleStruct
      include Dry::Equalizer.new(:text_section_id)
      include Packaging::EpubV3::HasPath

      attribute :document, Types.Instance(Nokogiri::XML::Document)
      attribute :namespace_set, HTMLNodes::NamespaceSet
      attribute :node, HTMLNodes::Node
      attribute :referenced_items, Types::Array.of(Packaging::EpubV3::ReferencedItem)
      attribute :remote_resources, Types::Array.of(Packaging::EpubV3::RemoteResourceItem)
      attribute :text_section, Types.Instance(TextSection)
      attribute :stylesheets, Types::Array.of(Packaging::EpubV3::StylesheetItem)

      delegate :epub_type, :has_epub_type?, to: :node
      delegate :id, to: :text_section, prefix: true
      delegate :name, :text, to: :text_section

      def has_landmark?
        landmark.present?
      end

      def has_remote_resources?
        referenced_items.any?(&:external_source?)
      end

      # @!attribute [r] landmark
      # @return [{ Symbol => String }]
      memoize def landmark
        default_landmark.tap do |h|
          found = text.landmark_for text_section

          next h unless found

          h[:title] = found["label"]
          h[:type] = found["type"]
        end
      end

      # @return [StringIO]
      def to_io
        StringIO.new(document.to_xhtml)
      end

      # @return [String]
      memoize def toc_text
        found = text.toc_entry_for text_section

        found&.[]("label").presence || name
      end

      private

      def build_base_path
        "text/#{text_section.source_identifier}".gsub(/\A(.+)(?<!\.xhtml)\z/, '\1.xhtml')
      end

      def default_landmark
        return {} unless has_epub_type?

        {}.tap do |h|
          next unless has_epub_type?

          h[:title] = name
          h[:type] = epub_type
        end
      end
    end
  end
end
