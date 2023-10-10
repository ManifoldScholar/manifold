require "memoist"

module Ingestions
  module Strategies
    class Epub < Ingestions::Strategies::AbstractStrategy

      extend Memoist

      def perform
        manifest
      end

      def determine_ingestibility
        context.dir?(File.join(inspector.rel_source_root, "/META-INF"))
      end

      private

      def manifest
        {}.with_indifferent_access.tap do |hash|
          hash[:attributes] = attributes
          hash[:relationships] = relationships
          hash[:start_section_identifier] = inspector.start_section_identifier
        end
      end

      # rubocop:disable Metrics/AbcSize
      def attributes
        {}.with_indifferent_access.tap do |hash|
          hash[:publication_date] = inspector.date_node&.text
          hash[:description] = inspector.description_node&.text
          hash[:metadata] = metadata
          hash[:toc] = structure_attributes.toc
          hash[:landmarks] = structure_attributes.landmarks
          hash[:page_list] = structure_attributes.page_list
        end
      end
      # rubocop:enable Metrics/AbcSize

      def relationships
        {}.with_indifferent_access.tap do |hash|
          hash[:text_titles] = titles || []
          hash[:ingestion_sources] = ingestion_sources
          hash[:text_sections] = text_sections
          hash[:creators] = creators || []
          hash[:contributors] = contributors || []
        end
      end

      def metadata
        {}.with_indifferent_access.tap do |hash|
          hash[:unique_identifier] = inspector.unique_id
          hash[:language] = inspector.language_node&.text
          hash[:rights] = inspector.rights_node&.text
        end
      end

      def text_sections
        inspector.spine_item_nodes.map.with_index do |node, index|
          position = index + 1
          examiner = Strategy::Epub::TextSection.new self, node, position
          attributes = examiner.attributes
          build_path = context.write_build_file attributes[:source_identifier],
                                                examiner.raw_html
          attributes.merge(build: build_path)
        end
      end

      def ingestion_sources
        inspector.manifest_item_nodes.map do |node|
          Strategy::Epub::IngestionSource.new(node, inspector).attributes
        end
      end
      memoize :ingestion_sources

      def titles
        inspector.title_nodes.map do |node|
          Strategy::Epub::Title.new(node, inspector).attributes
        end
      end

      def creators
        inspector.creator_nodes&.map do |node|
          Strategy::Epub::Maker.new(node, inspector).attributes
        end
      end

      def contributors
        inspector.contributor_nodes&.map do |node|
          Strategy::Epub::Maker.new(node, inspector).attributes
        end
      end

      def structure_attributes
        Strategy::Epub::Structure.new inspector
      end
    end
  end
end
