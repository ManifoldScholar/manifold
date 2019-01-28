class RenameCollectionsToResourceCollections < ActiveRecord::Migration[5.0]
  def change
    rename_table :collections, :resource_collections
    rename_column :annotations, :collection_id, :resource_collection_id
    rename_column :collection_resources, :collection_id, :resource_collection_id
    rename_column :resource_import_rows, :collection_id, :resource_collection_id
  end
end
