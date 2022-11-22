module Ingestions
  module Strategies
    class Document < Ingestions::Strategies::AbstractStrategy

      delegate :text, to: :ingestion, prefix: :existing
      delegate :text_sections, to: :existing_text, prefix: :existing, allow_nil: true
      delegate :reingest?, to: :ingestion

      def perform
        preprocess
        maybe_fix_legacy_source_identifiers!
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
          source_identifier: text_section_source_identifier,
          name: inspector.title,
          kind: ::TextSection::KIND_SECTION,
          position: 1,
          build: build
        }
      end

      def text_section_source_identifier
        Digest::MD5.hexdigest(inspector.basename)
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

      # Prior to V1, we used a different method for calculating the source_identifier.
      # When ingestion was refactored, we ended up with a stable source identifier for all
      # document ingestions. This poses a problem when a reingestion happens on a text
      # that was ingested prior to v1.
      #
      # If the following conditions are true, this method will make a quick update to the
      # existing text_section and associated ingestion_source so that their identifiers
      # match those of the new ingestion. Once the identifiers match, the compiler will
      # trigger an update instead of an insert + delete. Conditions that must be met are
      # as follows:
      #
      # 1. We're reingesting, not ingesting
      # 2. The text being updated exists and has one text section that is KIND_SECTION
      # 3. None of the text's text sections have the correct source identifier
      #
      def maybe_fix_legacy_source_identifiers!
        return unless reingest?

        return unless existing_text.present? && existing_text_sections.count == 1
        return if existing_text_sections.where(source_identifier: text_section_source_identifier).any?

        existing_text_section = existing_text_sections.find_by(text: existing_text, kind: ::TextSection::KIND_SECTION)
        [existing_text_section, existing_text_section.ingestion_source].each do |resource|
          resource.update_column(:source_identifier, text_section_source_identifier)
        end
      end
    end
  end
end
