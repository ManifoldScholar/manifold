class AddReaderRoleToRolelessUsers < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        say_with_time 'Inserting reader role if necessary' do
          execute <<~SQL.strip_heredoc
            INSERT INTO roles (name, created_at, updated_at)
              SELECT 'reader', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
              WHERE NOT EXISTS (
                SELECT id FROM roles
                WHERE name = 'reader'
                AND resource_id IS NULL
                AND resource_type IS NULL
              )
          SQL
        end

        say_with_time 'Adding reader role to users who did not already have one' do
          execute <<~SQL.strip_heredoc
            WITH users_sans_roles AS (
              SELECT id AS user_id FROM users
              WHERE id NOT IN (SELECT DISTINCT user_id FROM users_roles) 
            ), default_roles AS (
              SELECT id AS role_id FROM roles WHERE name = 'reader'
            ), new_user_roles AS (
              SELECT user_id, role_id FROM users_sans_roles, default_roles
            )
              INSERT INTO users_roles (user_id, role_id) SELECT * FROM new_user_roles
          SQL
        end
      end
    end
  end
end
