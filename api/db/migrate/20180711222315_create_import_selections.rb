class CreateImportSelections < ActiveRecord::Migration[5.0]
  def change
    create_table :import_selections, id: :uuid do |t|
      t.references :text, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.string :source_text_id, null: false

      t.text :previous_text, null: true
      t.text :previous_body, null: true

      t.text :body, null: false

      t.text :next_body, null: true
      t.text :next_text, null: true

      t.integer :matches_count, null: false, default: 0

      t.jsonb :comments,    null: false, default: []
      t.jsonb :highlights,  null: false, default: []

      t.timestamp :imported_at, null: true

      t.timestamps

      t.index :source_text_id
      t.index :matches_count
      t.index :imported_at
    end
  end
end
