class TextNodes < ActiveRecord::Migration[5.0]
  def change
    create_table :searchable_nodes, id: :uuid do |t|
      t.uuid :text_section_id
      t.string :node_uuid
      t.text :content
      t.integer :position
      t.timestamps
    end
  end
end
