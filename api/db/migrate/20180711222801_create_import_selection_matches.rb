class CreateImportSelectionMatches < ActiveRecord::Migration[5.0]
  def change
    create_table :import_selection_matches, id: :uuid do |t|
      t.references :import_selection, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.references :searchable_node,  type: :uuid, null: true, foreign_key: { on_delete: :cascade }
      t.references :text_section,     type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.references :annotation,       type: :uuid, null: true, foreign_key: { on_delete: :nullify }

      t.integer :start_char,  null: true
      t.integer :end_char,    null: true

      t.timestamps
    end
  end
end
