SELECT
  id, user_id, collectable_type AS favoritable_type, collectable_id AS favoritable_id, project_id,
  created_at, updated_at
FROM user_collected_composite_entries
