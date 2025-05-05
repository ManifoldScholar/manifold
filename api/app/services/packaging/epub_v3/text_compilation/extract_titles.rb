# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      # Extract {TextTitle text titles} from a given {Text} and
      # add them to the state
      class ExtractTitles
        include ::Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Text] :text
        # @return [void]
        def call
          state[:titles] = []

          item_state = { language: state[:text].language_plaintext }

          state[:text].titles.order(position: :asc).each do |title|
            kind = TextTitleKind[title.kind]

            next unless kind.present? && kind.has_gepub_type?

            item = Packaging::EpubV3::TitleItem.new(
              item_state.merge(
                kind: kind,
                text_title: title
              )
            )

            state[:titles] << item
          end

          Success()
        end
      end
    end
  end
end
