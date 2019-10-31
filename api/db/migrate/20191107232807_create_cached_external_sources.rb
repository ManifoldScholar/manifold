class CreateCachedExternalSources < ActiveRecord::Migration[5.2]
  def change
    create_table :cached_external_sources, id: :uuid do |t|
      t.text :url,                null: false
      t.text :source_identifier,  null: false
      t.text :kind,               null: false, default: "unknown"
      t.text :content_type,       null: false

      t.jsonb :asset_data
      t.jsonb :metadata, null: false, default: {}

      t.timestamps

      t.index %i[source_identifier], unique: true
      t.index %i[url], unique: true
    end
  end
end
