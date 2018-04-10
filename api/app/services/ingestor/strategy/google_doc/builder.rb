module Ingestor
  module Strategy
    module GoogleDoc
      # rubocop: disable Metrics/ClassLength
      class Builder < ::Ingestor::Strategy::AbstractBuilder

        def title_inspectors
          [Ingestor::Strategy::GoogleDoc::Inspector::Title.new(@inspector)]
        end

        def creator_inspectors
          []
        end

        def contributor_inspectors
          []
        end

        def language_inspector
          @inspector
        end

        def date_inspector
          @inspector
        end

        def unique_id_inspector
          @inspector
        end

        def rights_inspector
          @inspector
        end

        def spine_inspector
          @inspector
        end

        def description_inspector
          @inspector
        end

        def ingestion_source_inspectors
          @inspector.ingestion_source_inspectors
        end

        def stylesheet_inspectors
          @inspector.stylesheet_inspectors
        end

        def text_section_inspectors
          @inspector.text_section_inspectors
        end

        def cover_inspector
          @inspector
        end

        def structure_inspector
          @inspector
        end

        def start_section_inspector
          @inspector
        end

      end
      # rubocop: enable Metrics/ClassLength
    end
  end
end
