# frozen_string_literal: true

module Search
  class TertiaryData
    include Utility::EnhancedStoreModel

    attribute :creator, :string
    attribute :parent_keywords, :string_array
  end
end
