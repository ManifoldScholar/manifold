class DropSearchableNodes < ActiveRecord::Migration[5.1]
  def change

    remove_index :import_selection_matches, :searchable_node_id
    remove_column :import_selection_matches, :searchable_node_id, :uuid

    drop_table :searchable_nodes do |t|
      t.uuid :text_section_id
      t.string :node_uuid
      t.text :content
      t.integer :position
      t.timestamps
      t.text "contains", default: [], array: true
      t.index ["text_section_id"], name: "index_searchable_nodes_on_text_section_id"
    end
  end
end
