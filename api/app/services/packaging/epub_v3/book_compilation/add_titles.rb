# frozen_string_literal: true

module Packaging
  module EpubV3
    module BookCompilation
      class AddTitles
        include ::Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [Dry::Monads::Success(Packaging::EpubV3::BookContext)]
        def call(context)
          context.with! :book, :compiled_text do |book, compiled_text|
            compiled_text.titles.each do |title|
              book.add_title(*title.to_gepub_args, **title.to_gepub_options)
            end
          end

          Success context
        end
      end
    end
  end
end
