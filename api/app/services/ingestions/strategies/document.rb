module Ingestions
  module Strategies
    class Document < Ingestions::Strategies::AbstractStrategy

      def perform
        preprocess

        manifest
      end

      def determine_ingestibility
        inspector.non_stylesheet_sources.length == 1
      end

      private

      def build
        "build/#{inspector.basename}"
      end

      # Converts a single document into html (unvalidated by us) and
      # write it to the working build dir.  This then becomes our inspector
      # document, so that we're sure we're always inspecting an HTML document.
      def preprocess
        raw_html = compose Ingestions::Converter,
                           source_path: inspector.source
        context.write_build_file inspector.basename, raw_html
      end

      def manifest
        {}.with_indifferent_access.tap do |hash|
          hash[:attributes] = attributes
          hash[:relationships] = relationships
        end
      end

      def attributes
        {}.with_indifferent_access.tap do |hash|
          hash[:publication_date] = inspector.date
          hash[:description] = inspector.description
          hash[:metadata] = metadata
          hash[:toc] = []
          hash[:landmarks] = []
          hash[:page_list] = []
        end
      end

      def relationships
        {}.with_indifferent_access.tap do |hash|
          hash[:text_titles] = [title]
          hash[:ingestion_sources] = ingestion_sources
          hash[:text_sections] = [text_section]
          hash[:makers] = makers || []
          hash[:stylesheets] = stylesheets || []
        end
      end

      def metadata
        {}.with_indifferent_access.tap do |hash|
          hash[:unique_identifier] = inspector.unique_id
          hash[:language] = inspector.language
          hash[:rights] = inspector.rights
        end
      end

      def title
        {
          value: inspector.title,
          position: 1,
          kind: ::TextTitle::KIND_MAIN
        }
      end

      def ingestion_sources
        context.sources.map do |source|
          Strategy::Document::IngestionSource.new(self, source).attributes
        end
      end

      def text_section
        {
          source_identifier: context.basename(inspector.index_path),
          name: inspector.title,
          kind: ::TextSection::KIND_SECTION,
          position: 1,
          build: build
        }
      end

      def makers
        maker_names = inspector.creators + inspector.contributors
        maker_names.map do |name|
          {
            name: name
          }
        end
      end

      def stylesheets
        inspector.style_nodes.map.with_index do |node, index|
          examiner = Strategy::Document::Stylesheet.new self, node, index
          attributes = examiner.attributes
          path = context.write_build_file "#{attributes[:name]}.css",
                                          examiner.raw_styles

          attributes.merge(build: path)
        end
      end

    end
  end
end
