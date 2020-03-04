class AddUserRoleColumns < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.text :role
      t.text :kind

      t.index :role
      t.index :kind
    end

    reversible do |dir|
      dir.up do
        say_with_time "Updating role kinds" do
          execute(<<~SQL.strip_heredoc.squish).cmdtuples
          UPDATE users u SET role = udr.role, kind = udr.kind
          FROM user_derived_roles udr
          WHERE udr.user_id = u.id
          SQL
        end
      end
    end

    change_column_null :users, :role, false
    change_column_null :users, :kind, false
  end
end
