class AddCounterCacheToComments < ActiveRecord::Migration[5.0]
  def change
    add_column :comments, :children_count, :integer, default: 0
  end
end
