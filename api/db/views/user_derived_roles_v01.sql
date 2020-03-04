SELECT u.id AS user_id,
  COALESCE(
    (
      array_agg(
        r.name
        ORDER BY
        CASE "r"."name"
        WHEN 'admin' THEN 1
        WHEN 'editor' THEN 2
        WHEN 'project_creator' THEN 3
        WHEN 'marketeer' THEN 4
        WHEN 'reader' THEN 8
        ELSE 20
        END ASC
      ) FILTER (WHERE r.kind = 'global')
    )[1],
    'reader'
  ) AS role,
  COALESCE(
    (
      array_agg(
        r.name
        ORDER BY
        CASE "r"."name"
        WHEN 'admin' THEN 1
        WHEN 'editor' THEN 2
        WHEN 'project_creator' THEN 3
        WHEN 'marketeer' THEN 4
        WHEN 'project_editor' THEN 5
        WHEN 'project_resource_editor' THEN 6
        WHEN 'project_author' THEN 7
        WHEN 'reader' THEN 8
        ELSE 20
        END ASC
      ) FILTER (WHERE r.kind IN ('global', 'scoped'))
    )[1],
    'reader'
  ) AS kind
  FROM users u
  LEFT OUTER JOIN users_roles ur ON ur.user_id = u.id
  LEFT OUTER JOIN roles r ON r.id = ur.role_id AND r.kind IN ('global', 'scoped')
  GROUP BY u.id
;
