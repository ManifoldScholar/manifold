class DropSubtitleFromJournalIssues < ActiveRecord::Migration[6.0]
  def change
    remove_column :journal_issues, :subtitle, :string
  end
end
