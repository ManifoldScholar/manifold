module Ingestions
  module Compilers
    class TextSection < AbstractInteraction
      hash :manifest, strip: false
      object :text
      hash :attributes do
        string :build
        string :source_identifier
        string :name
        string :kind
        integer :position
      end

      def execute
        update_or_create
        report
      end

      private

      def text_section
        @text_section ||= initialize_text_section
      end

      def update_or_create
        text_section.update adjusted_attributes
      end

      def initialize_text_section
        text.text_sections.find_or_initialize_by(
          source_identifier: attributes[:source_identifier]
        )
      end

      def adjusted_attributes
        attributes.clone.tap do |hash|
          hash[:text] = text
          hash[:ingestion_source] = ingestion_source
          hash[:source_body] = source_body
        end.except(:build)
      end

      def source_body
        context.read(attributes[:build])
      end

      def ingestion_source
        text.ingestion_sources.find_by(source_identifier: attributes[:source_identifier])
      end

      def report
        key = if text_section.id_previously_changed?
                "services.ingestions.compiler.text_section.log.new"
              else
                "services.ingestions.compiler.text_section.log.updated"
              end

        info key, name: text_section.name
      end
    end
  end
end
