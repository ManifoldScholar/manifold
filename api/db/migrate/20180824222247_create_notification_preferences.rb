class CreateNotificationPreferences < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        create_table :notification_preferences, id: :uuid do |t|
          t.references :user, type: :uuid, index: true, null: false, foreign_key: { on_delete: :cascade }
          t.string :kind, null: false
          t.string :frequency, null: false, default: "never"
          t.timestamps

          t.index %i{user_id kind}, unique: true
          t.index :kind
          t.index :frequency
        end

        say_with_time "Inserting notification preferences for users based on roles" do
          execute <<~SQL.squish
            WITH user_roles AS (
              SELECT u.id AS user_id, (
                CASE
                WHEN x.applicable_roles @> '{admin}' THEN 'admin'
                WHEN x.applicable_roles @> '{editor}' THEN 'editor'
                WHEN x.applicable_roles @> '{project_creator}' THEN 'project_creator'
                WHEN x.applicable_roles @> '{marketeer}' THEN 'marketeer'
                WHEN x.applicable_roles @> '{project_editor}' THEN 'project_editor'
                WHEN x.applicable_roles @> '{project_resource_editor}' THEN 'project_resource_editor'
                WHEN x.applicable_roles @> '{project_author}' THEN 'project_author'
                ELSE
                  'reader'
                END
                ) AS role
              FROM users u
              LEFT OUTER JOIN (
                SELECT array_agg(r.name) AS applicable_roles,
                  ur.user_id AS user_id
                FROM roles r
                INNER JOIN users_roles ur ON ur.role_id = r.id 
                WHERE
                (r.name IN ('admin', 'editor', 'project_creator', 'marketeer') AND r.resource_id IS NULL AND r.resource_type IS NULL)
                OR
                (r.name IN ('project_editor', 'project_resource_editor', 'project_author'))
                GROUP BY ur.user_id
              ) AS x ON x.user_id = u.id
            ), user_mapped_preferences AS (
              SELECT ur.user_id, unnest(
                CASE ur.role
                WHEN 'admin' THEN ARRAY['digest','digest_comments_and_annotations','flagged_resources','projects','project_comments_and_annotations','followed_projects','replies_to_me']
                WHEN 'editor' THEN ARRAY['digest','digest_comments_and_annotations','projects','project_comments_and_annotations','followed_projects','replies_to_me']
                WHEN 'marketeer' THEN ARRAY['digest','digest_comments_and_annotations','followed_projects','replies_to_me']
                WHEN 'project_creator' THEN ARRAY['digest','digest_comments_and_annotations','followed_projects','replies_to_me']
                WHEN 'project_editor' THEN ARRAY['digest','digest_comments_and_annotations','projects','project_comments_and_annotations','followed_projects','replies_to_me']
                WHEN 'project_resource_editor' THEN ARRAY['digest','digest_comments_and_annotations','followed_projects','replies_to_me']
                WHEN 'project_author' THEN ARRAY['digest','digest_comments_and_annotations','projects','project_comments_and_annotations','followed_projects','replies_to_me']
                ELSE ARRAY['digest','digest_comments_and_annotations','followed_projects','replies_to_me']
                END
              ) AS kind
              FROM user_roles ur
            ) INSERT INTO notification_preferences (user_id, kind, created_at, updated_at) SELECT user_id, kind, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM user_mapped_preferences;
          SQL
        end

        say_with_time 'Updating followed_projects default preference' do
          execute <<~SQL.squish
            UPDATE notification_preferences SET frequency = 'always' WHERE kind = 'followed_projects' AND created_at = updated_at
          SQL
        end
      end

      dir.down do
        drop_table :notification_preferences
      end
    end
  end
end
