class AddIsCliUserBooleanToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :is_cli_user, :boolean, default: false
  end
end
