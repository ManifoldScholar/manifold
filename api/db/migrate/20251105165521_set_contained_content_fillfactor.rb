# frozen_string_literal: true

class SetContainedContentFillfactor < ActiveRecord::Migration[7.0]
  # Needed for REINDEX INDEX CONCURRENTLY
  disable_ddl_transaction!

  def up
    execute <<~SQL
    ALTER INDEX index_text_section_nodes_contained_content_indexing SET (fillfactor=90);
    SQL

    execute <<~SQL
    REINDEX INDEX CONCURRENTLY index_text_section_nodes_contained_content_indexing;
    SQL
  end

  def down
    # Intentionally left blank
  end
end
