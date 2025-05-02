# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      class CompileTextSections
        include Packaging::PipelineOperation
        include Packaging::EpubV3::Import[text_section_pipeline: "text_section_compilation.pipeline"]

        def call
          text_sections = state[:text].text_sections.includes(:stylesheets)

          state[:text_sections] = text_sections.map do |text_section|
            result = text_section_pipeline.(text_section)

            return result if result.failure?

            result.value!
          end

          Success()
        end
      end
    end
  end
end
