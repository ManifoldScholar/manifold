class DropFlagsFromComments < ActiveRecord::Migration[5.0]
  def change
    remove_column :comments, :flags, :integer
    add_column :comments, :flags_count, :integer
  end
end
