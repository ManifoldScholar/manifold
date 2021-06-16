SELECT
    rg.id AS reading_group_id,
    rgm.user_id,
    COUNT(DISTINCT a.id) FILTER (WHERE a.format = 'annotation' AND NOT orphaned) AS annotations_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.format = 'annotation' AND orphaned) AS orphaned_annotations_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.format = 'highlight' AND NOT orphaned) AS highlights_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.format = 'highlight' AND orphaned) AS orphaned_highlights_count,
    COUNT(DISTINCT c.id) FILTER (WHERE NOT a.orphaned) AS comments_count,
    COUNT(DISTINCT c.id) FILTER (WHERE a.orphaned) AS orphaned_comments_count
  FROM reading_groups rg
  LEFT OUTER JOIN annotations a ON a.reading_group_id = rg.id
  LEFT OUTER JOIN reading_group_memberships rgm ON rgm.reading_group_id = rg.id
  LEFT OUTER JOIN comments c ON c.subject_type = 'Annotation' AND c.subject_id = a.id AND c.creator_id = rgm.user_id
  GROUP BY rg.id, rgm.user_id
