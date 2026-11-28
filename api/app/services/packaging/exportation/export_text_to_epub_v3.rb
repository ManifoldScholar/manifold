# frozen_string_literal: true

module Packaging
  module Exportation
    class ExportTextToEpubV3 < ActiveInteraction::Base
      include MonadicInteraction

      record :text

      boolean :force, default: false

      # @return [Packaging::EpubV3::BookContext]
      attr_reader :book_context

      # @return [TextExport]
      attr_reader :text_export

      # @return [TextExport]
      def execute
        @text_export = ::TextExport.find_or_initialize_for_epub_v3 text

        return @text_export unless should_run?

        begin_run!
        compile!

        return @text_export
      rescue StandardError => e
        record_failure! code: :uncaught_exception, detail: e.message, exception_class: e.class.name

        return @text_export
      end

      def book_pipeline
        @book_pipeline ||= Packaging::EpubV3::Container["book_compilation.pipeline"]
      end

      private

      # A new export runs once; an existing one re-runs only to resume processing or retry a failure
      def should_run?
        @text_export.new_record? || force || @text_export.failure? || @text_export.processing?
      end

      def begin_run!
        @text_export.save! if @text_export.new_record?
        @text_export.transition_to!(:pending) unless @text_export.pending? || @text_export.processing?
        @text_export.transition_to!(:processing) unless @text_export.processing?
      end

      def compile!
        step_args = { finalize!: [{ text_export: @text_export }] }

        book_pipeline.with_step_args(**step_args).call(text) do |m|
          m.success do |result|
            @book_context = result

            @text_export.transition_to! :success
          end

          m.failure do |(code, reason)|
            record_failure! code: code, detail: reason
          end
        end
      end

      # Disable the toggle so automation won't retry and capture the reason to report to the client.
      # "detail" is kept in the db for dev investigation, but is not exposed to the client.
      def record_failure!(code:, detail: nil, **context)
        text.disable_epub_v3_export!

        return unless @text_export&.persisted?

        url = detail[:url] if detail.is_a?(Hash)
        raw = detail.is_a?(Hash) ? detail[:cause] : detail

        metadata = { code: code.to_s, reason: humanize_failure(code, url), detail: raw&.to_s, **context }.compact

        @text_export.transition_to! :failure, metadata
      end

      def humanize_failure(code, url = nil)
        case code
        when :failed_export
          "The generated EPUB could not be saved."
        when :invalid_request_options
          "A resource referenced in the text has an invalid URL#{with_url url}. Correct the link in the text."
        when :socket_error, :error
          "A resource referenced in the text could not be retrieved#{with_url url}. " \
            "Verify the URL is correct and publicly accessible."
        when Integer
          "A resource referenced in the text returned an error (HTTP #{code})#{with_url url}. " \
            "Check the URL and that it is publicly accessible."
        else
          "An unexpected error occurred while generating the EPUB."
        end
      end

      def with_url(url)
        url.present? ? " (#{url})" : ""
      end
    end
  end
end
