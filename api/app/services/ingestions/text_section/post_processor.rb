module Ingestions
  module TextSection
    class PostProcessor < Ingestions::AbstractInteraction
      hash :manifest, strip: false
      object :text_section
      record :text

      def execute
        transform_text_sections
        validate_stylesheets
        text
      end

      private

      def transform_text_sections
        info "services.ingestions.post_processor.log.transforming_ts"

        compose Ingestions::PostProcessors::TextSectionBody, text_section: text_section
      end

      def validate_stylesheets
        info "services.ingestions.post_processor.log.transforming_ss"

        text.stylesheets.ingested.each do |stylesheet|
          compose Ingestions::PostProcessors::Stylesheet,
                  stylesheet: stylesheet
        end
      end
    end
  end
end
