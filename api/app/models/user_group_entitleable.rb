# frozen_string_literal: true

class UserGroupEntitleable < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor

  belongs_to :user_group, inverse_of: :entitleables
  belongs_to :entitleable, polymorphic: true

  attr_accessor :target_url
  attr_writer :expiration

  before_validation :maybe_derive_entitleable
  before_validation :parse_expiration!
  after_create :sync_member_entitlements!
  after_update :sync_member_entitlement_expirations!, if: :saved_change_to_expires_on?
  after_destroy :sync_member_entitlements!

  # @!attribute [r] expiration
  # @return [String, nil] a string representation of the expiration date
  def expiration
    return nil unless expires_on?

    expires_on.to_s
  end

  private

  def maybe_derive_entitleable
    return unless target_url.present?

    self.entitleable = GlobalID.parse(target_url).find
  rescue ActiveRecord::RecordNotFound
    self.entitleable = nil
    Rils.logger.warn("Entitleable not found for GID #{target_url}")
  end

  def parse_expiration!
    return unless defined?(@expiration)

    parsed = ManifoldApi::Container["entitlements.parse_expiration"].(@expiration)

    Dry::Matcher::ResultMatcher.(parsed) do |m|
      m.success { |expires_on| self.expires_on = expires_on }
      m.failure(:past) { errors.add :expiration, "must be in the future" }
      m.failure { errors.add :expiration, "did not produce a valid date" }
    end
  end

  def sync_member_entitlements!
    user_group.sync_member_entitlements!
  end

  def sync_member_entitlement_expirations!
    UserGroupEntitleables::SyncExpiration.new.call(self)
  end
end
