module Ingestions
  module TextSection
    class Compiler < Ingestions::AbstractInteraction

      hash :manifest, strip: false
      record :text
      string :text_section_id, default: ""

      def execute
        create_records :ingestion_sources
        create_records :stylesheets
        create_text_section
      end

      private

      def create_text_section
        attributes = manifest[:relationships]["text_sections"].first
        return unless attributes.present?

        compose_into :text_section, Ingestions::TextSection::Updater, attributes: attributes, text: text, text_section_id: text_section_id
      end

      def create_records(klass)
        klass_attributes = manifest[:relationships][klass]
        return unless klass_attributes.present?

        klass_attributes.each do |attributes|
          compose "Ingestions::Compilers::#{klass.to_s.classify}".constantize,
                  attributes: attributes
        end
      end
    end
  end
end
