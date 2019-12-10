class CreateProjectExports < ActiveRecord::Migration[5.2]
  def change
    create_table :project_exports, id: :uuid do |t|
      t.references :project, null: false, type: :uuid, foreign_key: { on_delete: :restrict }
      t.text :export_kind, null: false, default: "unknown"
      t.text :fingerprint, null: false

      t.jsonb :asset_data
      t.jsonb :metadata, null: false, default: {}

      t.timestamps

      t.index %i[project_id export_kind fingerprint], unique: true, name: "index_project_exports_uniqueness"
      t.index :asset_data, using: :gin
    end
  end
end
