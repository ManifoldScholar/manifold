class ChangeResourceDimensionsToString < ActiveRecord::Migration[6.1]
  def up
    change_column :resources, :minimum_width, :string, null: true
    change_column :resources, :minimum_height, :string, null: true
  end

  def down
    change_column :resources, :minimum_width, :integer
    change_column :resources, :minimum_height, :integer
  end
end
