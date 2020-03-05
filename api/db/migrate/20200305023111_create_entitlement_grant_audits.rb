class CreateEntitlementGrantAudits < ActiveRecord::Migration[5.2]
  def change
    create_view :entitlement_grant_audits, materialized: true

    change_table :entitlement_grant_audits do |t|
      t.index %i[user_id entitlement_role_id resource_id resource_type role_name], unique: true, name: "entitlement_grant_audits_pkey"
      t.index :action
    end
  end
end
