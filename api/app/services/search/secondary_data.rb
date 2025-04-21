# frozen_string_literal: true

module Search
  class SecondaryData
    include Utility::EnhancedStoreModel

    attribute :keywords, :string_array
    attribute :makers, :string_array
  end
end
