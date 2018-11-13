class AddPrefixToMakers < ActiveRecord::Migration[5.0]
  def change
    add_column :makers, :prefix, :string
  end
end
