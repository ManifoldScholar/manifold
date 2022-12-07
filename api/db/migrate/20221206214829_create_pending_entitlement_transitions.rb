# frozen_string_literal: true

class CreatePendingEntitlementTransitions < ActiveRecord::Migration[6.0]
  def change
    create_table :pending_entitlement_transitions, id: :uuid do |t|
      t.references :pending_entitlement, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: false
      t.boolean :most_recent, null: false
      t.integer :sort_key, null: false
      t.string :to_state, null: false
      t.jsonb :metadata

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %i(pending_entitlement_id sort_key), unique: true, name: "index_pending_entitlement_transitions_parent_sort"
      t.index %i(pending_entitlement_id most_recent), unique: true, where: "most_recent", name: "index_pending_entitlement_transitions_parent_most_recent"
    end
  end
end
