class CreateEntitlementTargets < ActiveRecord::Migration[5.2]
  def change
    create_view :entitlement_targets
  end
end
