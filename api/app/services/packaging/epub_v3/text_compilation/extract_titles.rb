module Packaging
  module EpubV3
    module TextCompilation
      # Extract {TextTitle text titles} from a given {Text} and
      # add them to the state
      class ExtractTitles
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [Text] :text
        # @return [void]
        def call(state)
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
        end
      end
    end
  end
end
