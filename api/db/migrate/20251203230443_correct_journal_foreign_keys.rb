# frozen_string_literal: true

class CorrectJournalForeignKeys < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        exec_update(<<~SQL, "Correct journal_id foreign key on journal_volumes")
          DELETE FROM journal_volumes
          WHERE journal_id IS NOT NULL
            AND journal_id NOT IN (
              SELECT j.id
              FROM journals j
            )
        SQL

        exec_update(<<~SQL, "Correct journal_id foreign key on journal_issues")
          DELETE FROM journal_issues
          WHERE journal_id IS NOT NULL
            AND journal_id NOT IN (
              SELECT j.id
              FROM journals j
            )
        SQL

        exec_update(<<~SQL, "Clean up journal_volume_id foreign key on journal_issues")
          UPDATE journal_issues ji
          SET journal_volume_id = NULL
          WHERE ji.journal_volume_id IS NOT NULL
            AND ji.journal_volume_id NOT IN (
              SELECT jv.id
              FROM journal_volumes jv
            )
        SQL
      end
    end

    add_foreign_key :journal_volumes, :journals, column: :journal_id, on_delete: :restrict

    add_foreign_key :journal_issues, :journals, column: :journal_id, on_delete: :restrict

    add_foreign_key :journal_issues, :journal_volumes, column: :journal_volume_id, on_delete: :restrict

    change_table :projects do |t|
      t.uuid :orphaned_journal_issue_id

      t.boolean :orphaned_journal_issue, null: false, default: false
    end

    reversible do |dir|
      dir.up do
        say_with_time "Populating orphaned_journal_issue for existing Project records" do
          exec_update(<<~SQL, "Populate orphaned_journal_issue")
            UPDATE projects p
            SET
              orphaned_journal_issue = TRUE,
              orphaned_journal_issue_id = p.journal_issue_id,
              journal_issue_id = NULL
            WHERE p.journal_issue_id IS NOT NULL
              AND p.journal_issue_id NOT IN (
                SELECT ji.id
                FROM journal_issues ji
              )
          SQL
        end
      end

      dir.down do
        say_with_time "Reverting orphaned_journal_issue for existing Project records" do
          exec_update(<<~SQL, "Revert orphaned_journal_issue")
            UPDATE projects p
            SET
              journal_issue_id = p.orphaned_journal_issue_id,
              orphaned_journal_issue = FALSE,
              orphaned_journal_issue_id = NULL
            WHERE p.orphaned_journal_issue = TRUE
          SQL
        end
      end
    end

    add_foreign_key :projects, :journal_issues, column: :journal_issue_id, on_delete: :restrict
  end
end
