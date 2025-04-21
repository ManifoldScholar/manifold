# frozen_string_literal: true

module Search
  class Metadata
    include Utility::EnhancedStoreModel

    attribute :arbitrary, :any_json
  end
end
