class AddHomePagePriorityToJournals < ActiveRecord::Migration[6.0]
  def change
    add_column :journals, :home_page_priority, :integer, default: 0, null: false
  end
end
