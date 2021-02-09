class CreateReadingGroupTexts < ActiveRecord::Migration[6.0]
  def change
    create_table :reading_group_texts, id: :uuid do |t|
      t.references :reading_group, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :text, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :reading_group_category, null: true, type: :uuid, foreign_key: { on_delete: :nullify }
      t.integer :position

      t.timestamps

      t.index %i[reading_group_id text_id], unique: true, name: "index_reading_group_texts_uniqueness"
      t.index %i[reading_group_id reading_group_category_id position], name: "index_reading_group_texts_ordering"
    end
  end
end
