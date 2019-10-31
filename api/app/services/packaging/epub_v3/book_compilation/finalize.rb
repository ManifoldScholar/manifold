module Packaging
  module EpubV3
    module BookCompilation
      # Generate the book as a side-effect.
      class Finalize
        include Dry::Transaction::Operation

        # @param [Packaging::EpubV3::BookContext] context
        # @param [TextExport] text_export
        # @return [Dry::Types::Result(Packaging::EpubV3::CompiledText)]
        def call(context, text_export: nil)
          text_export ||= ::TextExport.find_or_initialize_for_epub_v3 context

          catch :failure do
            context.with! :book, :epub_path do |book, epub_path|
              book.generate_epub epub_path

              epub_file = File.open epub_path

              text_export.asset = epub_file

              fail_export!(text_export) unless text_export.save
            end

            Success(context)
          end
        end

        private

        def fail_export!(text_export)
          fail! :failed_export, "Could not export text: #{text_export.flattened_errors}"
        end

        def fail!(code, reason)
          throw :failure, Failure([code, reason])
        end
      end
    end
  end
end
