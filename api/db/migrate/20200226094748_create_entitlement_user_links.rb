class CreateEntitlementUserLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :entitlement_user_links, id: :uuid do |t|
      t.references :entitlement,  type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.references :user,         type: :uuid, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps

      t.index %i[entitlement_id user_id], unique: true, name: "entitlement_user_links_uniqueness"
    end
  end
end
