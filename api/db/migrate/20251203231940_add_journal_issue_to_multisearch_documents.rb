# frozen_string_literal: true

class AddJournalIssueToMultisearchDocuments < ActiveRecord::Migration[7.0]
  def change
    change_table :pg_search_documents do |t|
      t.references :journal_issue, type: :uuid, foreign_key: { on_delete: :nullify }, index: true

      t.boolean :journal_content, null: false, default: false
    end

    reversible do |dir|
      dir.up do
        say_with_time "Populating project-based journal issue data for existing PgSearch::Document records" do
          exec_update(<<~SQL, "Populate project-based journal issue data")
          WITH issues AS (
            SELECT
              'Project' AS searchable_type,
              p.id AS searchable_id,
              p.journal_issue_id AS journal_issue_id,
              TRUE as journal_content
            FROM projects p
            WHERE p.journal_issue_id IS NOT NULL
          )
          UPDATE pg_search_documents psd
          SET
            journal_issue_id = ji.journal_issue_id,
            journal_content = ji.journal_content
          FROM issues ji
          WHERE psd.searchable_type = ji.searchable_type
            AND psd.searchable_id = ji.searchable_id
          ;
          SQL
        end

        say_with_time "Marking journals as journal content in PgSearch::Document records" do
          exec_update(<<~SQL, "Mark journals as journal content")
          UPDATE pg_search_documents psd
          SET journal_content = TRUE
          WHERE searchable_type = 'Journal';
          SQL
        end
      end
    end
  end
end
