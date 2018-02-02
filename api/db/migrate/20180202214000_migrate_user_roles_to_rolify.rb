class MigrateUserRolesToRolify < ActiveRecord::Migration[5.0]
  def up
    say_with_time "Inserting global roles" do
      execute <<~SQL.squish
        INSERT INTO roles (name, created_at, updated_at)
          VALUES
          ('reader', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      SQL
    end

    say_with_time "Populating user_roles" do
      execute <<~SQL.squish
        INSERT INTO users_roles (user_id, role_id) (
          SELECT u.id AS user_id, r.id AS role_id
          FROM users u
          INNER JOIN roles r ON r.name = u.role AND u.role IN ('admin', 'reader')
            WHERE r.resource_id IS NULL AND r.resource_type IS NULL
        )
      SQL
    end

    remove_column :users, :role
  end

  def down
    add_column :users, :role, :string, default: "reader", null: false

    say_with_time "Setting user roles" do
      execute <<~SQL.squish
        UPDATE users
          SET role = 'admin'
          FROM roles r, users_roles ur
          WHERE ur.role_id = r.id AND ur.user_id = users.id AND r.name = 'admin' AND r.resource_type IS NULL
      SQL
    end

    say_with_time "Removing global roles" do
      execute <<~SQL.squish
        DELETE FROM roles
      SQL
    end
  end
end
