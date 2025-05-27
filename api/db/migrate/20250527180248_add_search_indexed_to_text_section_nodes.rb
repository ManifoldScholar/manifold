# frozen_string_literal: true

class AddSearchIndexedToTextSectionNodes < ActiveRecord::Migration[7.0]
  def change
    change_table :text_section_nodes do |t|
      t.timestamp :search_indexed_at, precision: 6

      t.boolean :search_indexed, null: false, default: false

      t.index :id, name: "index_text_section_nodes_missing_search_index", where: %[NOT search_indexed]
    end

    reversible do |dir|
      dir.up do
        if !Rails.env.test? && defined?(::TextSectionNodes::BackportSearchIndexJob)
          begin
            ::TextSectionNodes::BackportSearchIndexJob.set(wait: 10.minutes).perform_later
          rescue StandardError
            # Intentionally left blank
          end
        end
      end
    end
  end
end
