class AddEventsCountToCollections < ActiveRecord::Migration[5.0]
  def change
    add_column :collections, :events_count, :integer, default: 0
  end
end
