class RemoveSortNameFromMakers < ActiveRecord::Migration[5.0]
  def change
    remove_column :makers, :sort_name, :string
  end
end
