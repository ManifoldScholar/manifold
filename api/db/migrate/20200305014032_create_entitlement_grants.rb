class CreateEntitlementGrants < ActiveRecord::Migration[5.2]
  def change
    create_view :entitlement_grants, materialized: true

    change_table :entitlement_grants do |t|
      t.index %i[user_id entitlement_role_id resource_id resource_type role_name role_kind], unique: true, name: "entitlement_grants_pkey"
    end
  end
end
