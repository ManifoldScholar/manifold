# frozen_string_literal: true

class EnhanceTextSectionNodes < ActiveRecord::Migration[6.1]
  def change
    change_table :text_section_nodes do |t|
      t.text :contained_node_uuids, array: true, null: false, default: []
      t.text :contained_content
    end

    reversible do |dir|
      dir.up do
        execute <<~SQL
        ALTER TABLE text_section_nodes
          ADD COLUMN tsv_contained_content tsvector NOT NULL GENERATED ALWAYS AS (public.to_unaccented_weighted_tsv(contained_content, 'A')) STORED
        ;
        SQL

        say_with_time "Making text section nodes searchable" do
          exec_update(<<~SQL)
          WITH contained AS (
            SELECT
              pn.id AS id,
              array_agg(cn.node_uuid ORDER BY cn.node_indices) FILTER (WHERE cn.node_uuid IS NOT NULL) AS contained_node_uuids,
              string_agg(cn.content, ' ' ORDER BY cn.node_indices) FILTER (WHERE cn.content IS NOT NULL AND cn.content ~ '[^[:space:]]+') AS contained_content
              FROM text_section_nodes pn
              INNER JOIN text_section_nodes cn ON pn.node_path @> cn.node_path
              GROUP BY 1
          )
          UPDATE text_section_nodes tsn SET contained_node_uuids = COALESCE(c.contained_node_uuids, '{}'::text[]), contained_content = c.contained_content
          FROM contained c
          WHERE
            c.id = tsn.id
          ;
          SQL
        end
      end

      dir.down do
        execute <<~SQL
        ALTER TABLE text_section_nodes
          DROP COLUMN tsv_contained_content;
        SQL
      end
    end

    change_table :text_section_nodes do |t|
      t.index :tsv_contained_content, using: :gin
    end
  end
end
