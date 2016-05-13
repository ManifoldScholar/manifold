class AddNicknameToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :nickname, :text
  end
end
