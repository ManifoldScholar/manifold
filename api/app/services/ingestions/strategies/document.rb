module Ingestions
  module Strategies
    class Document < Ingestions::Strategies::AbstractStrategy

      def perform
        preprocess

        manifest
      end

      def determine_ingestibility
        inspector.source.present?
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
          hash[:toc] = Strategy::Document::TOC.new(inspector).toc
          hash[:landmarks] = []
          hash[:page_list] = []
        end
      end

      def relationships
        {}.with_indifferent_access.tap do |hash|
          hash[:text_titles] = [title]
          hash[:ingestion_sources] = ingestion_sources
          hash[:text_sections] = [text_section]
          hash[:creators] = creators || []
          hash[:contributors] = contributors || []
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
          Strategy::Document::IngestionSource.new(context, inspector, source).attributes
        end
      end

      def text_section
        {
          source_identifier: Digest::MD5.hexdigest(inspector.basename),
          name: inspector.title,
          kind: ::TextSection::KIND_SECTION,
          position: 1,
          build: build
        }
      end

      def creators
        inspector.creators.map do |name|
          {
            name: name
          }
        end
      end

      def contributors
        inspector.contributors.map do |name|
          {
            name: name
          }
        end
      end
    end
  end
end
