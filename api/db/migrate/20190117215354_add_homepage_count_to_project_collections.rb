class AddHomepageCountToProjectCollections < ActiveRecord::Migration[5.0]
  def change
    add_column :project_collections, :homepage_count, :integer
  end
end
