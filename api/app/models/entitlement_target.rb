class EntitlementTarget < ApplicationRecord
  include Authority::Abilities
  include Concerns::View
  include Concerns::SerializedAbilitiesFor

  self.primary_key = :target_url

  belongs_to :target, polymorphic: true

  scope :in_order, -> { order(:sort_key) }
end
