SELECT
    rgm.id AS reading_group_membership_id,
    COUNT(*) FILTER (WHERE a.format = 'annotation' AND NOT orphaned) AS annotations_count,
    COUNT(*) FILTER (WHERE a.format = 'annotation' AND orphaned) AS orphaned_annotations_count,
    COUNT(*) FILTER (WHERE a.format = 'highlight' AND NOT orphaned) AS highlights_count,
    COUNT(*) FILTER (WHERE a.format = 'highlight' AND orphaned) AS orphaned_highlights_count
  FROM reading_group_memberships rgm
  LEFT OUTER JOIN annotations a ON a.creator_id = rgm.user_id AND a.reading_group_id = rgm.reading_group_id
  GROUP BY rgm.id
