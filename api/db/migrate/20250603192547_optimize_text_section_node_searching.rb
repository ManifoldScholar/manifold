# frozen_string_literal: true

class OptimizeTextSectionNodeSearching < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL
        DROP INDEX IF EXISTS index_text_section_nodes_on_tsv_contained_content;
        SQL

        execute <<~SQL
        CREATE STATISTICS text_section_nodes_depth_stats (ndistinct,dependencies) ON node_path, depth FROM text_section_nodes;
        SQL

        execute <<~SQL
        CREATE STATISTICS text_section_nodes_body_hash_stats (ndistinct,dependencies) ON text_section_id, body_hash FROM text_section_nodes;
        SQL

        execute <<~SQL
        CREATE INDEX index_text_section_nodes_searching ON text_section_nodes USING GIN (id, body_hash, text_section_id, (immutable_unaccent(coalesce(contained_content::text, ''))) gin_trgm_ops, tsv_contained_content) WITH (fastupdate=off);
        SQL
      end

      dir.down do
        execute <<~SQL
        DROP INDEX index_text_section_nodes_searching;
        SQL

        execute <<~SQL
        DROP STATISTICS text_section_nodes_body_hash_stats;
        SQL

        execute <<~SQL
        DROP STATISTICS text_section_nodes_depth_stats;
        SQL
      end
    end
  end
end
