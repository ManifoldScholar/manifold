class AddExcludeFromOAIToJournals < ActiveRecord::Migration[7.0]
  def change
    add_column :journals, :exclude_from_oai, :boolean, default: false
  end
end
