module Ingestions
  module Compilers
    class Stylesheet < AbstractInteraction
      hash :manifest, strip: false
      object :text
      hash :attributes do
        string :name
        boolean :ingested, default: true
        boolean :applies_to_all_text_sections, default: false
        integer :position, default: nil
        string :source_identifier, default: nil
        string :hashed_content
        string :build
      end

      def execute
        update_or_create
        report
      end

      private

      def stylesheet
        @stylesheet ||= initialize_stylesheet
      end

      def initialize_stylesheet
        text.stylesheets.find_or_initialize_by(
          source_identifier: attributes[:source_identifier],
          name: attributes[:name]
        )
      end

      def update_or_create
        stylesheet.update! adjusted_attributes
      end

      def adjusted_attributes
        attributes.clone.tap do |hash|
          hash[:ingested] = attributes[:ingested]
          hash[:raw_styles] = raw_styles
          hash[:ingestion_source] = ingestion_source
          hash[:creator] = context.creator
          hash[:skip_formatting] = true
          hash[:applies_to_all_text_sections] = attributes[:applies_to_all_text_sections]
        end.except(:build)
      end

      def ingestion_source
        return nil unless attributes[:source_identifier]

        text.ingestion_sources.find_by(source_identifier: attributes[:source_identifier])
      end

      def raw_styles
        context.read(attributes[:build])
      end

      def report
        key = if stylesheet.id_previously_changed?
                "services.ingestions.compiler.stylesheet.log.new"
              else
                "services.ingestions.compiler.stylesheet.log.updated"
              end

        info key, name: stylesheet.name
      end
    end
  end
end
