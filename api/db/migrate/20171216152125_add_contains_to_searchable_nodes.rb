class AddContainsToSearchableNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :searchable_nodes, :contains, :text, array: true, default: []
  end
end
