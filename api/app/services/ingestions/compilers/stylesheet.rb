module Ingestions
  module Compilers
    class Stylesheet < AbstractInteraction
      hash :manifest, strip: false
      object :text
      hash :attributes do
        string :name
        integer :position, default: nil
        string :source_identifier, default: nil
        string :build
      end

      def execute
        update_or_create
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
        stylesheet.update adjusted_attributes
      end

      def adjusted_attributes
        attributes.clone.tap do |hash|
          hash[:ingested] = true
          hash[:raw_styles] = raw_styles
          hash[:ingestion_source] = ingestion_source
          hash[:creator] = context.creator
        end.except(:build)
      end

      def ingestion_source
        return nil unless attributes[:source_identifier]
        text.ingestion_sources.find_by(source_identifier: attributes[:source_identifier])
      end

      def raw_styles
        context.read(attributes[:build])
      end

    end
  end
end
