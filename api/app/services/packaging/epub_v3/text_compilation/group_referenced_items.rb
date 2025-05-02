# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      class GroupReferencedItems
        include ::Packaging::PipelineOperation

        # @return [Dry::Monads::Success(void)]
        def call
          state[:referenced_items] = state[:text_sections].flat_map(&:referenced_items).group_by(&:path).map do |(path, references)|
            Packaging::EpubV3::GroupedReferencedItem.new(path: path, references: references)
          end

          Success()
        end
      end
    end
  end
end
