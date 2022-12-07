# frozen_string_literal: true

# @see Entitlements::PopulateGrants
class EntitlementGrant < ApplicationRecord
  classy_enum_attr :current_state, enum: "EntitlementState", allow_blank: false, default: :pending
  classy_enum_attr :role_name, enum: "RoleName", allow_blank: false
  classy_enum_attr :role_kind, enum: "RoleKind", allow_blank: false

  attribute :summaries, Entitlements::Summary.to_array_type

  belongs_to :user
  belongs_to :entitlement_role
  belongs_to :resource, polymorphic: true

  class << self
    # @return [Integer]
    def prune_previous!
      prune_except last_refresh_key
    end

    # @param [String] refresh_key
    # @return [Integer]
    def prune_except(refresh_key)
      where.not(refresh_key: refresh_key).delete_all
    end

    # @return [String, nil]
    def last_refresh_key
      order(refreshed_at: :desc).pick(:refresh_key)
    end
  end
end
