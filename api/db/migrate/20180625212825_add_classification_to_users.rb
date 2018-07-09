class AddClassificationToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :classification, :string, null: false, default: 'default'

    add_index :users, :classification, unique: true, name: "udx_users_anonymous",
      where: %[classification = 'anonymous']

    add_index :users, :classification, unique: true, name: "udx_users_cli",
      where: %[classification = 'command_line']

    reversible do |dir|
      dir.up do
        say_with_time 'Migrating original CLI row' do
          execute <<~SQL
          UPDATE users SET classification = 'command_line' WHERE is_cli_user = 't'
          SQL
        end

        remove_column :users, :is_cli_user
      end

      dir.down do
        if User.where(classification: 'anonymous').exists?
          raise ActiveRecord::IrreversibleMigration, "Cannot revert while anonymous exists"
        end

        add_column :users, :is_cli_user, null: false, default: false

        add_index :users, :is_cli_user, unique: true, name: "udx_users_is_cli_user",
          where: %[is_cli_user = 't']

        say_with_time 'Restoring old is_cli_user' do
          execute <<~SQL
          UPDATE users SET is_cli_user = 't' WHERE classification = 'command_line'
          SQL
        end
      end
    end
  end
end
