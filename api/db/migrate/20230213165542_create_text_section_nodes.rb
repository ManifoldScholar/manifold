class CreateTextSectionNodes < ActiveRecord::Migration[6.0]
  def change
    create_table :text_section_nodes, id: :uuid do |t|
      t.references :text_section, null: false, foreign_key: { on_delete: :cascade }, type: :uuid
      t.bigint :body_hash, null: false, default: 0
      t.column :node_root, :ltree, null: false
      t.column :node_path, :ltree, null: false
      t.text :path, array: true, null: false
      t.integer :node_indices, null: false, array: true
      t.bigint :depth, null: false, default: 0
      t.bigint :node_index, null: true

      t.text :node_type
      t.text :tag
      t.jsonb :node_attributes, null: false, default: {}
      t.text :node_uuid
      t.jsonb :node_extra

      t.text :text_digest
      t.text :content

      t.bigint :children_count, null: false, default: 0

      t.timestamp :extrapolated_at, null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %i[text_section_id body_hash], name: "index_text_section_nodes_by_id_and_hash"

      t.index %i[text_section_id extrapolated_at], name: "index_text_section_nodes_extrapolation"

      t.index :node_path, unique: true, name: "index_text_section_nodes_uniqueness"
      t.index :node_path, using: :gist
      t.index %i[node_path depth node_index], name: "index_text_section_nodes_child_ordering", using: :gist
    end

    reversible do |dir|
      dir.up do
        execute <<~SQL
        CREATE INDEX index_text_section_nodes_pairing ON text_section_nodes (node_path) INCLUDE (path);
        SQL

        execute <<~SQL
        CREATE INDEX index_text_section_nodes_by_uuid ON text_section_nodes (text_section_id, node_uuid) INCLUDE (node_path);
        SQL
      end
    end
  end
end
