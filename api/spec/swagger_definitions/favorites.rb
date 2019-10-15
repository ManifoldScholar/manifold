require 'rails_helper'
require_relative 'base_types'
require_relative 'me'

module Favorites
  class << self
    def get_model_attributes
      {
        favoritableType: Type.string,
        favoritableId: Type.id,
        subjectIds: Type.array({ type: Type.id })
      }
    end
  end
end
