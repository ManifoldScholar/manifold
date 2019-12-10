module Packaging
  module EpubV3
    module BookCompilation
      # Generate the book as a side-effect.
      class Finalize
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @param [TextExport] text_export
        # @return [Dry::Types::Result(Packaging::EpubV3::CompiledText)]
        def call(context, text_export: nil)
          text_export ||= ::TextExport.find_or_initialize_for_epub_v3 context

          maybe_fail do
            context.with! :book, :epub_path do |book, epub_path|
              book.generate_epub epub_path

              epub_file = File.open epub_path, "rb"

              text_export.asset = epub_file

              try_to_save! text_export, code: :failed_export, prefix: "Could not export text"
            end

            Success(context)
          end
        end
      end
    end
  end
end
