SELECT
    rgm.id AS reading_group_membership_id,
    COUNT(DISTINCT a.id) FILTER (WHERE a.creator_id = rgm.user_id AND a.format = 'annotation' AND NOT a.orphaned) AS annotations_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.creator_id = rgm.user_id AND a.format = 'annotation' AND a.orphaned) AS orphaned_annotations_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.creator_id = rgm.user_id AND a.format = 'highlight' AND NOT a.orphaned) AS highlights_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.creator_id = rgm.user_id AND a.format = 'highlight' AND a.orphaned) AS orphaned_highlights_count,
    COUNT(DISTINCT c.id) FILTER (WHERE NOT a.orphaned) AS comments_count,
    COUNT(DISTINCT c.id) FILTER (WHERE a.orphaned) AS orphaned_comments_count
  FROM reading_group_memberships rgm
  LEFT OUTER JOIN annotations a ON a.reading_group_id = rgm.reading_group_id
  LEFT OUTER JOIN comments c ON c.subject_type = 'Annotation' AND c.subject_id = a.id AND c.creator_id = rgm.user_id
  GROUP BY rgm.id
