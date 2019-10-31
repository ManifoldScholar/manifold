module Packaging
  module EpubV3
    module BookCompilation
      # Set up the initial state for the book compilation pipeline
      class Prepare
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::CompiledText] compiled_text
        # @return [Dry::Types::Result(Packaging::EpubV3::BookContext)]
        def call(compiled_text)
          state = Packaging::EpubV3::BookContext.new(
            book: GEPUB::Book.new,
            compiled_text: compiled_text
          )

          Success(state)
        end
      end
    end
  end
end
