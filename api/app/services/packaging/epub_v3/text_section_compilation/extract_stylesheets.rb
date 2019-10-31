module Packaging
  module EpubV3
    module TextSectionCompilation
      # Extract {Stylesheet} resources into {Packaging::EpubV3::StylesheetItem wrapped proxies}.
      class ExtractStylesheets
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [TextSection] :text_section
        # @return [<Packaging::EpubV3::StylesheetItem>]
        def call(state)
          state[:text_section].stylesheets.map do |stylesheet|
            Packaging::EpubV3::StylesheetItem.new stylesheet: stylesheet
          end
        end
      end
    end
  end
end
