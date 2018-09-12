class AddDescriptionToProjectCollections < ActiveRecord::Migration[5.0]
  def change
    add_column :project_collections, :descriptions, :text
  end
end
