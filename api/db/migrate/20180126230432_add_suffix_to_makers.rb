class AddSuffixToMakers < ActiveRecord::Migration[5.0]
  def change
    add_column :makers, :suffix, :string
  end
end
