module Packaging
  module EpubV3
    module BookCompilation
      # Set the language for the Epub
      # rubocop:disable Style/ConditionalAssignment
      class SetLanguage
        include Dry::Transaction::Operation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            if compiled_text.has_language?
              book.language = compiled_text.language
            else
              # TODO: Generate some sort of warning once we have that system in place
              book.language = "en"
            end
          end
        end
      end
      # rubocop:enable Style/ConditionalAssignment
    end
  end
end
