class AddArchivedAtToReadingGroupMemberships < ActiveRecord::Migration[6.0]
  def change
    change_table :reading_group_memberships do |t|
      t.text :aasm_state, null: false, default: "active"
      t.text :role, null: false, default: "member"
      t.text :label, null: true, default: ""
      t.text :annotation_style, null: false, default: "solid"
      t.timestamp :archived_at, null: true

      t.index :aasm_state
    end

    reversible do |dir|
      dir.up do
        say_with_time "Updating moderator ReadingGroupMembership#role" do
          execute(<<~SQL.strip_heredoc).cmdtuples
          UPDATE reading_group_memberships rgm SET "role" = 'moderator'
          FROM reading_groups rg
          WHERE rg.creator_id = rgm.user_id
          SQL
        end

        say_with_time "Inserting moderator roles for said reading groups" do
          execute(<<~SQL.strip_heredoc).cmdtuples
          WITH groups_needing_role AS (
            SELECT reading_group_id, MIN(created_at) AS created_at, MAX(updated_at) AS updated_at FROM reading_group_memberships WHERE role = 'moderator' GROUP BY 1
          )
          INSERT INTO roles (name, resource_type, resource_id, kind, created_at, updated_at)
          SELECT 'moderator', 'ReadingGroup', gnr.reading_group_id, 'reading_group', gnr.created_at, gnr.updated_at FROM groups_needing_role gnr
          ON CONFLICT (name, resource_type, resource_id) DO NOTHING;
          SQL
        end

        say_with_time "Associating roles" do
          execute(<<~SQL.strip_heredoc).cmdtuples
          WITH matched_roles AS (
            SELECT rgm.user_id, r.id AS role_id
            FROM reading_group_memberships rgm
            INNER JOIN roles r ON r.name = 'moderator' AND r.resource_type = 'ReadingGroup' AND r.resource_id = rgm.reading_group_id
          )
          INSERT INTO users_roles (user_id, role_id)
          SELECT * FROM matched_roles
          ON CONFLICT (user_id, role_id) DO NOTHING;
          SQL
        end
      end

      dir.down do
        say_with_time "Removing moderator roles" do
          execute(<<~SQL.strip_heredoc).cmdtuples
          DELETE FROM roles WHERE name = 'moderator' AND resource_type = 'ReadingGroup'
          SQL
        end
      end
    end
  end
end
