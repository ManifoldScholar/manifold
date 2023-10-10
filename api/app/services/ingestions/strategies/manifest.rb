require "memoist"

module Ingestions
  module Strategies
    class Manifest < Ingestions::Strategies::AbstractStrategy
      extend Memoist

      def perform
        fetch_external

        preprocess

        manifest
      end

      def determine_ingestibility
        context.source_path_for_file("*", %w(yml yaml)).present?
      end

      private

      def fetch_external
        inspector.external_sources.each do |source|
          fetched = compose Ingestions::Fetcher, url: source["source_path"]
          next unless fetched.present?

          filename = Digest::MD5.hexdigest(source["source_path"])
          inspector.update_source_map(source["source_path"], "#{filename}.html")
          context.update_working_dirs(fetched[:file].path, filename)
        end
        inspector.update_toc
      end

      # NB: The output path is important here.  We need to preserve the
      # entire relative path to the file for cases where nested items have
      # the same file name.  The only thing that changes in the output
      # dir is the extension.
      def preprocess
        inspector.convertible_sources.each do |source|
          raw_html = compose Ingestions::Converter,
                             source_path: source
          rel_path = context.rel_path_without_ext source
          context.write_build_file "#{rel_path}.html", raw_html
        end
      end

      def manifest
        {}.with_indifferent_access.tap do |hash|
          hash[:attributes] = attributes
          hash[:relationships] = relationships
          hash[:start_section_identifier] = inspector.start_section_identifier
        end
      end

      def attributes
        {}.with_indifferent_access.tap do |hash|
          hash[:publication_date] = inspector.date
          hash[:description] = inspector.description
          hash[:metadata] = metadata
          hash[:toc] = inspector.toc
          hash[:landmarks] = []
          hash[:page_list] = []
        end
      end

      def relationships
        {}.with_indifferent_access.tap do |hash|
          hash[:text_titles] = [title]
          hash[:creators] = creators || []
          hash[:contributors] = contributors || []
          hash[:ingestion_sources] = ingestion_sources
          hash[:text_sections] = text_sections
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

      def creators
        inspector.creators
      end

      def contributors
        inspector.contributors
      end

      def ingestion_sources
        context.sources.map do |source|
          Strategy::Manifest::IngestionSource.new(self, source).attributes
        end
      end
      memoize :ingestion_sources

      def text_sections
        inspector.source_map.map.with_index do |source, index|
          examiner = Strategy::Manifest::TextSection.new self,
                                                         source,
                                                         ingestion_sources,
                                                         index + 1
          attributes = examiner.attributes
          build_path = context.write_build_file "#{examiner.source_identifier}.html",
                                                examiner.raw_html
          attributes.merge(build: build_path)
        end
      end
    end
  end
end
