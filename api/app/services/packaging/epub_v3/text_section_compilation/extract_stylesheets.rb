# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextSectionCompilation
      # Extract {Stylesheet} resources into {Packaging::EpubV3::StylesheetItem wrapped proxies}.
      class ExtractStylesheets
        include ::Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [TextSection] :text_section
        # @return [<Packaging::EpubV3::StylesheetItem>]
        def call
          state[:stylesheets] = state[:text_section].stylesheets.map do |stylesheet|
            Packaging::EpubV3::StylesheetItem.new(stylesheet:)
          end

          Success()
        end
      end
    end
  end
end
