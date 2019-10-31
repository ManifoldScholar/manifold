class CreateCachedExternalSourceLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :cached_external_source_links, id: :uuid do |t|
      t.references :cached_external_source, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :text, null: false, type: :uuid, foreign_key: { on_delete: :cascade }

      t.timestamps

      t.index %i[cached_external_source_id text_id], unique: true, name: "index_cached_external_source_link_uniqueness"
    end
  end
end
