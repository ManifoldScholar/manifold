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

        if @text_export.new_record? || force
          step_args = {
            finalize!: [text_export: @text_export]
          }

          book_pipeline.with_step_args(**step_args).call(text) do |m|
            m.success do |result|
              @book_context = result
            end

            m.failure do |error|
              errors.add :base, "Something went wrong compiling the book: #{error}"
            end
          end
        end

        return @text_export
      end

      def book_pipeline
        @book_pipeline ||= Packaging::EpubV3::Container["book_compilation.pipeline"]
      end
    end
  end
end
