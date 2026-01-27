class AddExcludeFromDirectoryToProjectsAndJournals < ActiveRecord::Migration[7.0]
  def change
    add_column :journals, :exclude_from_directory, :boolean, default: false
    add_column :projects, :exclude_from_directory, :boolean, default: false
  end
end
