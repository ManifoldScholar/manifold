require Rails.root.join "lib", "paperclip_migrator"

class CreateResourceImportAndResourceImportRows < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    enable_extension("pg_trgm")

    create_table :resource_imports, id: :uuid do |t|
      t.references :creator, type: :uuid, index: true, foreign_key: { to_table: :users }
      t.references :project, type: :uuid, index: true, foreign_key: { on_delete: :cascade }
      t.string :storage_type
      t.string :storage_identifier
      t.string :source, null: false
      t.string :url
      t.integer :header_row, default: 1
      t.jsonb :column_map, default: {}, null: false
      t.jsonb :column_automap, default: {}, null: false
      t.boolean :parse_error, null: false, default: false
      t.timestamps
    end

    paperclip_attachment :resource_imports, :data

    create_table :resource_import_rows, id: :uuid do |t|
      t.references :resource_import, type: :uuid, index: true, foreign_key: { on_delete: :cascade }
      t.references :resource, type: :uuid, index: true
      t.references :collection, type: :uuid, index: true
      t.string :row_type, default: "data"
      t.integer :line_number, null: false
      t.text :values, array: true, default: []
      t.text :import_errors, array: true, default: []
      t.timestamps
    end

    create_table :resource_import_transitions do |t|
      t.string :to_state, null: false
      t.jsonb :metadata, default: {}
      t.integer :sort_key, null: false
      t.uuid :resource_import_id, null: false
      t.boolean :most_recent, null: false
      t.timestamps null: false
    end

    add_foreign_key :resource_import_transitions, :resource_imports

    add_index(:resource_import_transitions,
              [:resource_import_id, :sort_key],
              unique: true,
              name: "index_resource_import_transitions_parent_sort")
    add_index(:resource_import_transitions,
              [:resource_import_id, :most_recent],
              unique: true,
              where: "most_recent",
              name: "index_resource_import_transitions_parent_most_recent")

    create_table :resource_import_row_transitions do |t|
      t.string :to_state, null: false
      t.jsonb :metadata, default: {}
      t.integer :sort_key, null: false
      t.uuid :resource_import_row_id, null: false
      t.boolean :most_recent, null: false
      t.timestamps null: false
    end

    add_foreign_key :resource_import_row_transitions, :resource_import_rows

    add_index(:resource_import_row_transitions,
              [:resource_import_row_id, :sort_key],
              unique: true,
              name: "index_resource_import_row_transitions_parent_sort")
    add_index(:resource_import_row_transitions,
              [:resource_import_row_id, :most_recent],
              unique: true,
              where: "most_recent",
              name: "index_resource_import_row_transitions_parent_most_recent")
  end
end
