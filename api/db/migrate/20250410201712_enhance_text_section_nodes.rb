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
