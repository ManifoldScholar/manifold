class CreateReadingGroupCompositeEntries < ActiveRecord::Migration[6.0]
  def change
    create_table :reading_group_composite_entries, id: :uuid do |t|
      t.references :reading_group, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_rgce_reading_group_reference" }
      t.references :collectable, null: false, type: :uuid, polymorphic: true, index: { name: "index_rgce_collectable_reference" }
      t.references :reading_group_category, null: true, type: :uuid, foreign_key: { on_delete: :nullify }, index: { name: "index_rgce_category_reference" }

      t.references :reading_group_project, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_rgce_project_reference" }
      t.references :reading_group_resource, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_rgce_resource_reference" }
      t.references :reading_group_resource_collection, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_rgce_resource_collection_reference" }
      t.references :reading_group_text, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_rgce_text_reference" }

      t.text :collectable_jsonapi_type, null: false

      t.timestamps

      t.index %i[reading_group_id collectable_type collectable_id], unique: true, name: "index_rgce_uniqueness"
    end
  end
end
