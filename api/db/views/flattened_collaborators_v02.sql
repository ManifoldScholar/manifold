SELECT
  (collaboratable_id::text || '-' || maker_id::text) AS id,
  collaboratable_id,
  collaboratable_type,
  maker_id,
  array_agg(role ORDER BY priority ASC) AS roles,
  MIN(priority) AS priority,
  MIN(importance) AS importance,
  array_agg(id) AS collaborators,
  MIN(position) AS min_position
  FROM collaborators
  WHERE maker_id IS NOT NULL -- not ideal, but the table currently has no null constraint on that field and fixing that is a separate issue
  GROUP BY collaboratable_id, collaboratable_type, maker_id
  ORDER BY min_position ASC
