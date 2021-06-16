class CreateReadingGroupCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :reading_group_categories, id: :uuid do |t|
      t.references :reading_group, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.integer :position, null: true
      t.text :title, null: false
      t.text :description, null: false
      t.text :slug, null: false
      t.jsonb :fa_cache, null: false, default: {}

      t.timestamps

      t.index %i[reading_group_id slug], unique: true, name: "index_reading_group_categories_uniqueness"
      t.index %i[reading_group_id position], name: "index_reading_group_categories_ordering"
    end
  end
end
