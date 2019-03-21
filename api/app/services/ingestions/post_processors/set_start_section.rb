module Ingestions
  module PostProcessors
    class SetStartSection < AbstractInteraction
      hash :manifest, strip: false
      object :text

      def execute
        return unless start_section_identifier.present?
        return unless manifest_start_text_section.present?
        return unless text_section.present?

        set_start_section
        report
      end

      private

      def set_start_section
        text.update start_text_section: text_section
      end

      def report
        info "services.ingestions.post_processor.log.start_section",
             source_identifier: text_section.source_identifier
      end

      def start_section_identifier
        @start_section_identifier ||= manifest[:start_section_identifier]
      end

      def manifest_start_text_section
        @manifest_start_text_section ||= begin
          manifest[:relationships][:text_sections].detect do |ts|
            ts[:source_identifier] == manifest[:start_section_identifier]
          end
        end
      end

      def text_section
        @text_section ||= text.text_sections.find_by(source_identifier: manifest_start_text_section[:source_identifier])
      end
    end
  end
end
