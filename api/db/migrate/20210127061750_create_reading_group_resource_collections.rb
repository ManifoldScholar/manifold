class CreateReadingGroupResourceCollections < ActiveRecord::Migration[6.0]
  def change
    create_table :reading_group_resource_collections, id: :uuid do |t|
      t.references :reading_group, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :resource_collection, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_reading_group_resource_collection_reference" }
      t.references :reading_group_category, null: true, type: :uuid, foreign_key: { on_delete: :nullify }, index: { name: "index_reading_group_resource_collection_category_reference" }
      t.integer :position

      t.timestamps

      t.index %i[reading_group_id resource_collection_id], unique: true, name: "index_reading_group_resource_collections_uniqueness"
      t.index %i[reading_group_id reading_group_category_id position], name: "index_reading_group_resource_collections_ordering"
    end
  end
end
