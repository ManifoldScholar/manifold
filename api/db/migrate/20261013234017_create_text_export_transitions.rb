# frozen_string_literal: true

class CreateTextExportTransitions < ActiveRecord::Migration[7.0]
  def change
    create_table :text_export_transitions, id: :uuid do |t|
      t.text :to_state, null: false
      t.jsonb :metadata, default: {}
      t.integer :sort_key, null: false
      t.references :text_export, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.boolean :most_recent, null: false, default: false

      t.timestamps null: false

      t.index %i[text_export_id sort_key], unique: true, name: "index_text_export_transitions_parent_sort"
      t.index %i[text_export_id most_recent], unique: true, where: "most_recent", name: "index_text_export_transitions_parent_most_recent"
    end
  end
end
