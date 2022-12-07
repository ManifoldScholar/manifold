class CreateJournalProjectLinks < ActiveRecord::Migration[6.0]
  def change
    create_view :journal_project_links
  end
end
