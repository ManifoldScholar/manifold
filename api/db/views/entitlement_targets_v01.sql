SELECT 'User' AS target_type, id AS target_id,
  CONCAT('gid://manifold-api/User/', id) AS target_url,
  CONCAT(first_name, ' ', last_name) AS name,
  'public' AS visibility,
  CONCAT('1', first_name, ' ', last_name) AS sort_key
  FROM users
  WHERE classification = 'default'
UNION ALL
SELECT 'ReadingGroup' AS target_type, id AS target_id,
  CONCAT('gid://manifold-api/ReadingGroup/', id) AS target_url,
  name AS name,
  CASE privacy WHEN 'public' THEN 'public' ELSE 'private' END AS visibility,
  CONCAT('2', name) AS sort_key
  FROM reading_groups
;
