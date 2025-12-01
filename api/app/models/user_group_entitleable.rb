class UserGroupEntitleable < ApplicationRecord
  belongs_to :user_group, inverse_of: :user_group_entitleables
  belongs_to :entitleable, polymorphic: true

  attr_reader :target_url

  before_save :maybe_derive_entitleable

  private

  def maybe_derive_entitleable
    return unless target_url.present?

    self.entitleable = GlobalID.parse(target_url).find
  rescue ActiveRecord::RecordNotFound
    self.entitleable = nil
    Rils.logger.warn("Entitleable not found for GID #{target_url}")
  end
end
