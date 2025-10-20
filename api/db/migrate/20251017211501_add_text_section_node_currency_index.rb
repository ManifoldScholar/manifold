# frozen_string_literal: true

class AddTextSectionNodeCurrencyIndex < ActiveRecord::Migration[7.0]
  # Needed for CREATE INDEX CONCURRENTLY
  disable_ddl_transaction!

  def change
    change_table :text_section_nodes do |t|
      t.index %i[text_section_id body_hash],
        name: "index_text_section_nodes_currency",
        algorithm: :concurrently
    end
  end
end
