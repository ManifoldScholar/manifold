class AddCommentsCountToResources < ActiveRecord::Migration[5.0]
  def change
    add_column :resources, :comments_count, :integer, default: 0
  end
end
