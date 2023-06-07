class AddIntermediateNodeToTextSectionNodes < ActiveRecord::Migration[6.0]
  def change
    change_table :text_section_nodes do |t|
      t.boolean :intermediate, null: false, default: false
      t.index :node_path, using: :gist, where: %[NOT intermediate], name: "index_text_section_nodes_actual_ancestors"
    end

    reversible do |dir|
      dir.up do
        say_with_time "Setting initial intermediate rows" do
          exec_update <<~SQL
          UPDATE text_section_nodes SET intermediate = TRUE WHERE tag IS NOT NULL AND tag IN ('mrow', 'mi');
          SQL
        end
      end
    end
  end
end
