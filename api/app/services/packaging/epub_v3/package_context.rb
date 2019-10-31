module Packaging
  module EpubV3
    class PackageContext
      extend Dry::Initializer
      extend Memoist

      TMP_ROOT = Rails.root.join("tmp")

      param :text, Types.Instance(::Text)

      delegate :id, to: :text, prefix: true

      # @param [String] text_section_id
      # @return [Packaging::EpubV3::TextSectionItem, nil]
      def find_text_section_by_id(text_section_id)
        each_text_section.detect do |text_section_item|
          text_section_item.text_section_id == text_section_id
        end
      end

      # @yieldparam [Packaging::EpubV3::StylesheetItem]
      def each_stylesheet
        return enum_for(__method__) unless block_given?

        stylesheets.each_value do |stylesheet|
          yield stylesheet
        end
      end

      # @yieldparam [Packaging::EpubV3::TextSectionItem]
      def each_text_section
        return enum_for(__method__) unless block_given?

        text_sections.each_value do |text_section|
          yield text_section
        end
      end

      memoize def ingestion_sources
        Utility::IndexMap.new(:manifold_path, Packaging::EpubV3::IngestionSourceItem)
      end

      memoize def references
        Concurrent::Map.new
      end

      memoize def stylesheets
        Utility::IndexMap.new(:path, Packaging::EpubV3::StylesheetItem)
      end

      # @!attribute [r] temporary_directory
      # @return [Pathname]
      memoize def temporary_directory
        Pathname.new Dir.mktmpdir(["gepub", text_id], TMP_ROOT)
      end

      memoize def text_sections
        Utility::IndexMap.new(:path, Packaging::EpubV3::TextSectionItem)
      end
    end
  end
end
