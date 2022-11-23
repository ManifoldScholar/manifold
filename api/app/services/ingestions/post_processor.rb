module Ingestions
  class PostProcessor < AbstractInteraction
    hash :manifest, strip: false
    object :text

    def execute
      remove_stale_records
      transform_text_sections
      validate_stylesheets
      set_start_section
      transform_toc
      set_text_cover

      text
    end

    private

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

      text.stylesheets.ingested.each do |stylesheet|
        compose PostProcessors::Stylesheet,
                stylesheet: stylesheet
      end
    end

    def set_start_section
      compose PostProcessors::SetStartSection
    end

    def remove_stale_records
      remove_stale_sections
      remove_stale_stylesheets
      text.reload
    end

    def remove_stale_sections
      text.text_sections.each do |section|
        next if manifest_spine.include? section.id
        next if section.toc?
        next if section.cover?

        section.destroy
        info "services.ingestions.post_processor.log.remove_text_section",
             id: section.id
      end
    end

    def manifest_spine
      identifiers = manifest[:relationships][:text_sections].map do |ts|
        ts[:source_identifier]
      end

      text.text_sections
        .where(source_identifier: identifiers)
        .order(position: :asc)
        .pluck(:id)
    end

    def remove_stale_stylesheets
      text.stylesheets.each do |stylesheet|
        next unless stylesheet.ingested?
        next if stylesheet.text_sections.any?

        stylesheet.destroy
        info "services.ingestions.post_processor.log.remove_stylesheet",
             id: stylesheet.id
      end
    end
  end
end
