class AddCounterCaches < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :resource_collections_count, :integer, default: 0
    add_column :projects, :resources_count, :integer, default: 0
  end
end
