# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      # Extract and flatten {Stylesheet} resources (which have
      # already {Packaging::EpubV3::StylesheetItem been wrapped}).
      #
      # @see Packaging::EpubV3::TextSectionCompilation::ExtractStylesheets
      class ExtractStylesheets
        include ::Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [<Packaging::EpubV3::TextSectionItem>] :text_sections
        # @return [Dry::Monads::Success(void)]
        def call
          state[:stylesheets] = state[:text_sections].flat_map(&:stylesheets).uniq

          Success()
        end
      end
    end
  end
end
