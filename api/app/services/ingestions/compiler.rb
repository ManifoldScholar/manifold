module Ingestions
  class Compiler < AbstractInteraction
    hash :manifest, strip: false

    def execute
      create_text
      create_records :text_titles
      create_records :ingestion_sources
      create_records :text_sections
      create_records :makers
      create_records :stylesheets

      text
    end

    private

    def text
      shared_inputs[:text]
    end

    def create_text
      compose_into :text, Compilers::Text
    end

    def create_records(klass)
      klass_attributes = manifest[:relationships][klass]
      klass_attributes.each do |attributes|
        compose "Ingestions::Compilers::#{klass.to_s.classify}".constantize,
                attributes: attributes
      end
    end
  end
end
