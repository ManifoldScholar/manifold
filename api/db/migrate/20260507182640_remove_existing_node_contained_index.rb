# frozen_string_literal: true

class RemoveExistingNodeContainedIndex < ActiveRecord::Migration[7.2]
  def up
    execute <<~SQL.squish
    DROP INDEX IF EXISTS index_text_section_nodes_contained_content_indexing;
    SQL
  end

  def down
    # Intentionally left blank
  end
end
