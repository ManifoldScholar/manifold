# frozen_string_literal: true

class ImproveTextSectionNodeIndex < ActiveRecord::Migration[7.0]
  # Needed for CREATE INDEX CONCURRENTLY
  disable_ddl_transaction!

  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL.squish
        DROP INDEX CONCURRENTLY IF EXISTS index_text_section_nodes_contained_content_indexing;
        SQL
      end
    end

    change_table :text_section_nodes do |t|
      t.index %i[text_section_id body_hash node_path id],
        name: "index_text_section_nodes_contained_content_indexing",
        opclass: { node_path: "gist_ltree_ops(siglen=24)" },
        algorithm: :concurrently,
        using: :gist
    end
  end
end
