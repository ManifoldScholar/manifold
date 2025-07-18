class CreateManifoldOAIRecords < ActiveRecord::Migration[7.0]
  def change
    create_table :manifold_oai_records, id: :uuid do |t|
      t.references :source, polymorphic: true, null: true, type: :uuid, index: { unique: true }

      t.text :oai_dc_content

      t.timestamp :deleted_at

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
    end
  end
end
