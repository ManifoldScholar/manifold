class AddRoleToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :role, :string
  end
end
