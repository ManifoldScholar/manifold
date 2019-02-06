class AddCollectionIndexes < ActiveRecord::Migration[5.1]
  def change
    add_index :collection_resources, :resource_collection_id
    add_index :project_collections, :homepage_start_date
    add_index :project_collections, :homepage_end_date
    add_index :resource_collections, :project_id
  end
end
