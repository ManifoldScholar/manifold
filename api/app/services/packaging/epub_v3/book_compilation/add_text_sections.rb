module Packaging
  module EpubV3
    module BookCompilation
      class AddTextSections
        include Dry::Transaction::Operation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            book.ordered do
              compiled_text.text_sections.each do |section|
                add_section! book, section
              end
            end
          end
        end

        private

        # @param [GEPUB::Book] book
        # @param [Packaging::EpubV3::TextSectionItem] section
        # @return [void]
        def add_section!(book, section)
          item = book.add_item section.path

          item.add_content section.to_io

          item.toc_text section.toc_text

          item.landmark section.landmark if section.has_landmark?

          item.set_media_type CoreMediaTypeKind::XHTML

          item.add_property("remote-resources") if section.has_remote_resources?
        end
      end
    end
  end
end
