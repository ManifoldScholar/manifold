module Packaging
  module EpubV3
    module BookCompilation
      class AddTitles
        include Dry::Transaction::Operation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with! :book, :compiled_text do |book, compiled_text|
            compiled_text.titles.each do |title|
              book.add_title(*title.to_gepub_args)
            end
          end
        end
      end
    end
  end
end
