module Packaging
  module EpubV3
    module TextCompilation
      # Extract and flatten {Stylesheet} resources (which have
      # already {Packaging::EpubV3::StylesheetItem been wrapped}).
      #
      # @see Packaging::EpubV3::TextSectionCompilation::ExtractStylesheets
      class ExtractStylesheets
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [<Packaging::EpubV3::TextSectionItem>] :text_sections
        # @return [<Packaging::EpubV3::StylesheetItem>]
        def call(state)
          state[:text_sections].flat_map(&:stylesheets).uniq
        end
      end
    end
  end
end
