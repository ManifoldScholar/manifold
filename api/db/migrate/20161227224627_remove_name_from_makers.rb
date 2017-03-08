class RemoveNameFromMakers < ActiveRecord::Migration[5.0]
  def change
    remove_column :makers, :name, :string
  end
end
