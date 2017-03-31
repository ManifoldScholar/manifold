class CreateIdentities < ActiveRecord::Migration[5.0]
  def change
    create_table :identities, id: :uuid do |t|
      t.references :user, foreign_key: { on_delete: :cascade }, null: false, index: true, type: :uuid

      t.text  :provider,  null: false
      t.text  :uid,       null: false
      t.jsonb :info,      null: false, default: "{}"

      t.timestamps null: false

      t.index %i[uid provider], unique: true
    end
  end
end
