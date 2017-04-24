class AddCounterCacheToCollection < ActiveRecord::Migration[5.0]
  def up
    add_column :collections, :collection_resources_count, :integer, default: 0

    Collection.pluck(:id).each do |id|
      Collection.reset_counters(id, :collection_resources)
    end
  end

  def down
    remove_column :collections, :collection_resources_count, :integer
  end
end
