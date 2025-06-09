# frozen_string_literal: true

class AddPositionToReadingGroupCompositeEntries < ActiveRecord::Migration[7.0]
  PAIRS = [
    ["reading_group_projects", "reading_group_project_id"],
    ["reading_group_resources", "reading_group_resource_id"],
    ["reading_group_resource_collections", "reading_group_resource_collection_id"],
    ["reading_group_texts", "reading_group_text_id"],
    ["reading_group_text_sections", "reading_group_text_section_id"],
    ["reading_group_journal_issues", "reading_group_journal_issue_id"]
  ].freeze

  def change
    change_table :reading_group_composite_entries do |t|
      t.bigint :position
    end

    reversible do |dir|
      dir.up do
        PAIRS.each do |(table, fk)|
          say_with_time "Inlining positions from #{table}" do
            exec_update <<~SQL
            UPDATE reading_group_composite_entries rgce SET position = src.position
            FROM #{table} src WHERE src.id = rgce.#{fk};
            SQL
          end
        end
      end
    end
  end
end
