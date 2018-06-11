module Ingestions
  class PostProcessor < AbstractInteraction
    object :text

    def execute
      transform_text_sections
      transform_toc
      generate_spine
      validate_stylesheets

      text
    end

    private

    def generate_spine
      compose PostProcessors::Spine
    end

    def transform_toc
      compose PostProcessors::TOC
    end

    def transform_text_sections
      text.text_sections.each do |text_section|
        compose PostProcessors::TextSectionBody,
                text_section: text_section
      end
    end

    def validate_stylesheets
      text.stylesheets.each do |stylesheet|
        compose PostProcessors::Stylesheet,
                stylesheet: stylesheet
      end
    end
  end
end
