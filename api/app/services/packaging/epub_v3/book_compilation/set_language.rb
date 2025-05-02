# frozen_string_literal: true

module Packaging
  module EpubV3
    module BookCompilation
      # Set the language for the Epub
      class SetLanguage
        include ::Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [Dry::Monads::Success(Packaging::EpubV3::BookContext)]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            if compiled_text.has_language?
              book.language = compiled_text.language
            else
              # TODO: Generate some sort of warning once we have that system in place
              book.language = "en"
            end
          end

          Success context
        end
      end
    end
  end
end
