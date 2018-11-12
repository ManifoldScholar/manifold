module Ingestions
  class PostProcessor < AbstractInteraction
    hash :manifest, strip: false
    object :text

    def execute
      generate_spine
      remove_stale_sections
      transform_text_sections
      validate_stylesheets
      set_start_section
      transform_toc
      set_text_cover

      text
    end

    private

    def generate_spine
      compose PostProcessors::Spine
    end

    def transform_toc
      info "services.ingestions.post_processor.log.transform_toc_structure"
      compose PostProcessors::TOC
    end

    def set_text_cover
      compose PostProcessors::SetTextCover
    end

    def transform_text_sections
      info "services.ingestions.post_processor.log.transforming_ts"

      text.text_sections.each do |text_section|
        compose PostProcessors::TextSectionBody,
                text_section: text_section
      end
    end

    def validate_stylesheets
      info "services.ingestions.post_processor.log.transforming_ss"

      text.stylesheets.each do |stylesheet|
        compose PostProcessors::Stylesheet,
                stylesheet: stylesheet
      end
    end

    def set_start_section
      return unless manifest[:start_section_identifier].present?
      section = text.text_sections
                    .find_by(source_identifier: manifest[:start_section_identifier])
      return unless section.present?
      text.update start_text_section: section
      info "services.ingestions.post_processor.log.start_section",
           source_identifier: section.source_identifier
    end

    def remove_stale_sections
      text.text_sections.each do |section|
        next if text.spine.include? section.id
        next if section.toc?
        next if section.cover?
        section.destroy
        info "services.ingestions.post_processor.log.remove_text_section",
             id: section.id
      end

      text.reload
    end
  end
end
