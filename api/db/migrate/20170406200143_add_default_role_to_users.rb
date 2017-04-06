class AddDefaultRoleToUsers < ActiveRecord::Migration[5.0]
  def up
    change_column :users, :role, :string, default: User::ROLE_READER
    execute "UPDATE users SET role = 'reader' WHERE role IS NULL"
  end

  def down
    change_column :users, :role, :string
  end
end
