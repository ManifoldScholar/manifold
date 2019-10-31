module Packaging
  module EpubV3
    module BookCompilation
      class AddStylesheets
        include Dry::Transaction::Operation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            compiled_text.stylesheets.each do |stylesheet|
              item = book.add_item stylesheet.path

              item.add_content stylesheet.to_io

              item.add_property("remote-resources") if stylesheet.has_remote_resources?
            end
          end
        end
      end
    end
  end
end
