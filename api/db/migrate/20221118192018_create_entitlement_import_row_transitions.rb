# frozen_string_literal: true

class CreateEntitlementImportRowTransitions < ActiveRecord::Migration[6.0]
  def change
    create_table :entitlement_import_row_transitions, id: :uuid do |t|
      t.string :to_state, null: false
      t.jsonb :metadata, default: {}
      t.integer :sort_key, null: false
      t.references :entitlement_import_row, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: false
      t.boolean :most_recent, null: false

      t.timestamps null: false
      t.index %i(entitlement_import_row_id sort_key), unique: true,
        name: "index_entitlement_import_row_transitions_parent_sort"
      t.index %i(entitlement_import_row_id most_recent), unique: true, where: "most_recent",
        name: "index_entitlement_import_row_transitions_parent_most_recent"
    end
  end
end
