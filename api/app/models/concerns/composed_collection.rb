# frozen_string_literal: true

module ComposedCollection
  extend ActiveSupport::Concern

  include Authority::Abilities
  include SerializedAbilitiesFor
  include View
end
