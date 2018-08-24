class AddEventsCountToComments < ActiveRecord::Migration[5.0]
  def change
    add_column :comments, :events_count, :integer, default: 0
  end
end
