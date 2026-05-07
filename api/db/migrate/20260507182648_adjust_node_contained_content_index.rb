# frozen_string_literal: true

class AdjustNodeContainedContentIndex < ActiveRecord::Migration[7.2]
  # Needed for CREATE INDEX CONCURRENTLY
  disable_ddl_transaction!

  def up
    execute <<~SQL
    CREATE INDEX CONCURRENTLY index_text_section_nodes_contained_content_indexing
      ON text_section_nodes USING gist (text_section_id, body_hash, node_path gist_ltree_ops(siglen=24))
      WITH (fillfactor='90')
    ;
    SQL
  end

  def down
    remove_index :text_section_nodes, name: "index_text_section_nodes_contained_content_indexing", algorithm: :concurrently
  end
end
