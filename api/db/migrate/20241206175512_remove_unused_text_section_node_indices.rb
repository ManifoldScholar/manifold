# frozen_string_literal: true

class RemoveUnusedTextSectionNodeIndices < ActiveRecord::Migration[6.1]
  def up
    execute <<~SQL
    DROP INDEX IF EXISTS index_text_section_nodes_pairing;

    DROP INDEX IF EXISTS index_text_section_nodes_on_node_path;

    DROP INDEX IF EXISTS index_text_section_nodes_by_id_and_hash;
    SQL
  end

  def down
    # Intentionally left blank. We won't add these indices back.
  end
end
