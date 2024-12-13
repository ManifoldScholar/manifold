SELECT
  flaggable_type,
  flaggable_id,
  COALESCE(
    array_agg(DISTINCT creator_id) FILTER (WHERE NOT resolved_by_creator),
    '{}'::uuid[]
  ) AS flagger_ids,
  COUNT(DISTINCT id) AS flags_count,
  COUNT(DISTINCT id) FILTER (WHERE resolved_at IS NOT NULL) AS resolved_flags_count,
  COUNT(DISTINCT id) FILTER (WHERE resolved_at IS NULL) AS unresolved_flags_count
  FROM flags
  GROUP BY 1, 2
