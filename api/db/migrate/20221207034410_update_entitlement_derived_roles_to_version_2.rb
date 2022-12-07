# frozen_string_literal: true

class UpdateEntitlementDerivedRolesToVersion2 < ActiveRecord::Migration[6.0]
  def change
    update_view :entitlement_derived_roles, version: 2, revert_to_version: 1
  end
end
