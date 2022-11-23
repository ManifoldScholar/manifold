class AddShortDescriptionToProjectCollections < ActiveRecord::Migration[6.0]
  def change
    add_column :project_collections, :short_description, :text
  end
end
