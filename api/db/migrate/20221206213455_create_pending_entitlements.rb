# frozen_string_literal: true

class CreatePendingEntitlements < ActiveRecord::Migration[6.0]
  def change
    create_table :pending_entitlements, id: :uuid do |t|
      t.references :creator, null: true, type: :uuid, foreign_key: { on_delete: :nullify, to_table: :users }
      t.references :entitlement, null: true, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :user, null: true, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :subject, null: false, type: :uuid, polymorphic: true

      t.text :expiration, null: true
      t.date :expires_on, null: true

      t.text :name, null: false
      t.citext :email, null: false

      t.text :first_name
      t.text :last_name

      t.text :messages, array: true, null: false, default: []

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
    end

    change_table :entitlement_import_rows do |t|
      t.references :pending_entitlement, null: true, type: :uuid, foreign_key: { on_delete: :nullify }

      t.text :expiration
      t.text :first_name
      t.text :last_name
    end
  end
end
