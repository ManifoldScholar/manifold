# frozen_string_literal: true

class AddVerifiedByAdminToUsers < ActiveRecord::Migration[6.1]
  def change
    change_table :users do |t|
      t.timestamp :verified_by_admin_at

      t.boolean :established, null: false, default: false
      t.boolean :trusted, null: false, default: false

      t.index :established
      t.index :trusted
    end

    reversible do |dir|
      dir.up do
        say_with_time "Calculating established for users" do
          exec_update <<~SQL
          UPDATE users SET established = email_confirmed_at IS NOT NULL;
          SQL
        end

        say_with_time "Calculating trusted for users" do
          exec_update <<~SQL
          WITH trustedness AS (
            SELECT DISTINCT "users"."id" AS user_id
            FROM "users"
            INNER JOIN "users_roles" ON "users_roles"."user_id" = "users"."id"
            INNER JOIN "roles" ON "roles"."id" = "users_roles"."role_id"
            WHERE
              (
                (roles.name IN ('admin', 'editor', 'moderator', 'marketeer')) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)
              )
              OR
              (
                (roles.name = 'project_editor') AND (roles.resource_type = 'Project')
              )
          )
          UPDATE users SET "trusted" = TRUE
          WHERE id IN (SELECT user_id FROM trustedness);
          SQL
        end
      end
    end
  end
end
