module Ingestions
  class Compiler < AbstractInteraction

    hash :manifest, strip: false

    def execute
      create_text
      destroy_value_objects :titles
      create_records :text_titles
      create_records :creators
      create_records :contributors
      create_records :ingestion_sources
      create_records :stylesheets
      create_records :text_sections
      text.reload
    end

    private

    def text
      shared_inputs[:text]
    end

    def create_text
      compose_into :text, Compilers::Text
    end

    def destroy_value_objects(association)
      text.send(association).destroy_all
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
