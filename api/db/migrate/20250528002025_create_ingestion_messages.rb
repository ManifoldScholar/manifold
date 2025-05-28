class CreateIngestionMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :ingestion_messages, id: :uuid do |t|
      t.references :ingestion, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.text :kind, null: false
      t.jsonb :payload, null: false

      t.timestamps
    end
  end
end
