class AddSortOrderToResources < ActiveRecord::Migration[6.1]
  def change
    add_column :resources, :sort_order, :integer, null: true
  end
end
