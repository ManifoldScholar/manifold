# frozen_string_literal: true

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

      # Opening the stored attachment yields a downloaded stream that carries no
      # filename, which would leave the re-attached cover without an extension.
      # Re-apply the source's filename so the cover keeps a usable extension.
      def cover
        io = cover_source.attachment.open
        name = cover_filename
        io.define_singleton_method(:original_filename) { name } if name.present?
        io
      end

      def cover_filename
        return @cover_filename if defined?(@cover_filename)

        @cover_filename = cover_source.attachment.original_filename.presence ||
                          File.basename(cover_source.source_path.to_s).presence
      end

      def cover_source
        return @cover_source if defined?(@cover_source)

        @cover_source = text.ingestion_sources
                  .find_by(kind: IngestionSource::KIND_COVER_IMAGE)
      end
    end
  end
end
