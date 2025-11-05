# frozen_string_literal: true

class AddUpdatedTextSectionSearchIndex < ActiveRecord::Migration[7.0]
  # Needed for CREATE INDEX CONCURRENTLY
  disable_ddl_transaction!

  def up
    execute <<~SQL
    DROP INDEX IF EXISTS index_text_section_nodes_searching;
    SQL

    execute <<~SQL
    CREATE INDEX CONCURRENTLY
    index_text_section_nodes_searching ON text_section_nodes USING GIN
      (
        id, text_section_id, (immutable_unaccent(coalesce(contained_content::text, ''))) gin_trgm_ops, tsv_contained_content
      )
      WITH (fastupdate=on)
      WHERE current
    ;
    SQL

    begin
      TextSections::MaintainAllCurrentNodesJob.set(wait: 1.minute).perform_later
    rescue StandardError
      # Intentionally left blank
    end
  end

  def down
    execute <<~SQL
    DROP INDEX IF EXISTS index_text_section_nodes_searching;
    SQL

    execute <<~SQL
    CREATE INDEX CONCURRENTLY index_text_section_nodes_searching ON text_section_nodes USING GIN (id, body_hash, text_section_id, (immutable_unaccent(coalesce(contained_content::text, ''))) gin_trgm_ops, tsv_contained_content) WITH (fastupdate=on);
    SQL
  end
end
