# frozen_string_literal: true

class UserGroupEntitleable < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor

  belongs_to :user_group, inverse_of: :entitleables
  belongs_to :entitleable, polymorphic: true

  attr_accessor :target_url

  before_validation :maybe_derive_entitleable

  private

  def maybe_derive_entitleable
    return unless target_url.present?

    self.entitleable = GlobalID.parse(target_url).find
  rescue ActiveRecord::RecordNotFound
    self.entitleable = nil
    Rils.logger.warn("Entitleable not found for GID #{target_url}")
  end
end
