class CreateEntitlementImportRows < ActiveRecord::Migration[6.0]
  def change
    create_table :entitlement_import_rows, id: :uuid do |t|
      t.references :entitlement_import, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :entitlement, null: true, type: :uuid, foreign_key: { on_delete: :nullify }
      t.references :subject, type: :uuid, polymorphic: true, null: true
      t.references :target, type: :uuid, polymorphic: true, null: true

      t.bigint :line_number, null: false

      t.citext :email, null: true

      t.date :expires_on, null: true

      t.text :messages, array: true, null: false, default: []

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index :email
      t.index %i[entitlement_import_id line_number], name: "index_entitlement_import_rows_ordering"
    end
  end
end
