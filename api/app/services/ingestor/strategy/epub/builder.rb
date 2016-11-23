module Ingestor
  module Strategy
    module EPUB
      # rubocop: disable Metrics/ClassLength
      class Builder < ::Ingestor::Strategy::AbstractBuilder

        def title_inspectors
          @inspector.title_nodes.map do |node|
            Inspector::Title.new(node, @inspector)
          end
        end

        def creator_inspectors
          @inspector.creator_nodes.map do |node|
            Inspector::Creator.new(node, @inspector)
          end
        end

        def contributor_inspectors
          @inspector.contributor_nodes.map do |node|
            Inspector::Creator.new(node, @inspector)
          end
        end

        def language_inspector
          Inspector::Language.new(@inspector)
        end

        def date_inspector
          Inspector::Date.new(@inspector)
        end

        def unique_id_inspector
          @inspector
        end

        def rights_inspector
          Inspector::Rights.new(@inspector)
        end

        def description_inspector
          Inspector::Description.new(@inspector)
        end

        def ingestion_source_inspectors
          @inspector.manifest_item_nodes.map do |node|
            Inspector::IngestionSource.new(node, @inspector)
          end
        end

        def stylesheet_inspectors
          @inspector.stylesheet_nodes.map do |node|
            Inspector::Stylesheet.new(node, @inspector)
          end
        end

        def text_section_inspectors
          @inspector.spine_item_nodes.map do |node|
            Inspector::TextSection.new(node, @inspector)
          end
        end

        def cover_inspector
          Inspector::Cover.new(@inspector)
        end

        def structure_inspector
          Inspector::Structure.new(@inspector)
        end

        def start_section_inspector
          @inspector
        end

      end
    end
  end
end
