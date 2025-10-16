# frozen_string_literal: true

class AddContainedContentHelperIndex < ActiveRecord::Migration[7.0]
  # Needed for CREATE INDEX CONCURRENTLY
  disable_ddl_transaction!

  def change
    change_table :text_section_nodes do |t|
      t.index %i[text_section_id body_hash node_path id],
        name: "index_text_section_nodes_contained_content_indexing",
        opclass: { node_path: "gist_ltree_ops(siglen=100)" },
        algorithm: :concurrently,
        using: :gist
    end
  end
end
