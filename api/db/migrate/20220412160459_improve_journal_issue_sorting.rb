class ImproveJournalIssueSorting < ActiveRecord::Migration[6.0]
  def change
    remove_index :journal_issues, name: "index_journal_issues_on_slug", column: :slug, unique: true
    remove_column :journal_issues, :slug, :string
    add_column :journal_issues, :sort_title, :integer, default: 0, null: false
    add_column :journal_issues, :pending_sort_title, :integer, null: true

    reversible do |change|
      change.up do
        change_column :journal_issues, :number, :string, default: "", null: false
        # Update the sort titles.
        JournalIssue.find_each(&:save)
      end

      change.down do
        rename_column :journal_issues, :number, :number_string_deprecated
        add_column :journal_issues, :number, :integer, default: 1, null: false
        JournalIssue.reset_column_information
        JournalIssue.find_each do |issue|
          issue.update_column(:number, issue.number_string_deprecated.to_i || 0)
        end
        remove_column :journal_issues, :number_string_deprecated
      end
    end
  end

end
