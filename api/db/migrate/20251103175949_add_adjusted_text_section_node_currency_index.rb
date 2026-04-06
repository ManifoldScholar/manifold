# frozen_string_literal: true

class AddAdjustedTextSectionNodeCurrencyIndex < ActiveRecord::Migration[7.0]
  # Needed for CREATE INDEX CONCURRENTLY
  disable_ddl_transaction!

  def up
    execute <<~SQL
    DROP INDEX IF EXISTS index_text_section_nodes_currency;
    SQL

    change_table :text_section_nodes do |t|
      t.index %i[text_section_id body_hash current],
        name: "index_text_section_nodes_currency",
        algorithm: :concurrently
    end
  end

  def down
    execute <<~SQL
    DROP INDEX IF EXISTS index_text_section_nodes_currency;
    SQL

    change_table :text_section_nodes do |t|
      t.index %i[text_section_id body_hash],
        name: "index_text_section_nodes_currency",
        algorithm: :concurrently
    end
  end
end
