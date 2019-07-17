module Ingestions
  module PostProcessors
    class SetTextCover < AbstractInteraction
      hash :manifest, strip: false
      object :text

      def execute
        return unless cover_source.present?

        set_text_cover
        report
      end

      private

      def report
        if text.cover.present?
          info "services.ingestions.post_processor.log.text_cover_present",
               filename: text.cover_file_name
        else
          info "services.ingestions.post_processor.log.text_cover_empty"
        end
      end

      def set_text_cover
        text.update cover: cover
      end

      def cover
        cover_source.attachment.open
      end

      def cover_source
        @cover_source ||= text.ingestion_sources
          .find_by(kind: IngestionSource::KIND_COVER_IMAGE)
      end
    end
  end
end
