class AddDisplayNameToIngestionSource < ActiveRecord::Migration[6.0]
  def change
    change_table :ingestion_sources do |t|
      t.text :display_name, null: true
      t.jsonb :fa_cache, default: {}, null: false
    end
  end
end
