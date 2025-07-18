class AddExcludeFromOAIToProjectsAndProjectCollections < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :exclude_from_oai, :boolean
    add_column :project_collections, :exclude_from_oai, :boolean
  end
end
