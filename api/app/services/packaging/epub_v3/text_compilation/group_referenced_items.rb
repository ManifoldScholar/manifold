module Packaging
  module EpubV3
    module TextCompilation
      class GroupReferencedItems
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [<Packaging::EpubV3::TextSectionItem>] :text_sections
        # @return [<Packaging::EpubV3::GroupedReferencedItem>]
        def call(state)
          state[:text_sections].flat_map(&:referenced_items).group_by(&:path).map do |(path, references)|
            Packaging::EpubV3::GroupedReferencedItem.new(path: path, references: references)
          end
        end
      end
    end
  end
end
