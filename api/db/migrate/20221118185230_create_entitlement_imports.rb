class CreateEntitlementImports < ActiveRecord::Migration[6.0]
  def change
    create_table :entitlement_imports, id: :uuid do |t|
      t.references :creator, null: true, type: :uuid, foreign_key: { on_delete: :nullify, to_table: :users }

      t.citext :name, null: false

      t.jsonb :file_data

      t.bigint :entitlement_import_rows_count, null: false, default: 0

      t.text :messages, array: true, null: false, default: []

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
    end
  end
end
