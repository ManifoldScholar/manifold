# frozen_string_literal: true

module Packaging
  module EpubV3
    module BookCompilation
      class SetPrimaryIdentifier
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [Dry::Monads::Success(Packaging::EpubV3::BookContext)]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            book.primary_identifier(*compiled_text.primary_identifier)
          end

          Success context
        end
      end
    end
  end
end
