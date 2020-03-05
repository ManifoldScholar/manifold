class CreateEntitlementDerivedRoles < ActiveRecord::Migration[5.2]
  def change
    create_view :entitlement_derived_roles
  end
end
