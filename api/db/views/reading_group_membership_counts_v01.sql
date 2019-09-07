SELECT
    rgm.id AS reading_group_membership_id,
    COUNT(*) FILTER (WHERE a.format = 'annotation') AS annotations_count,
    COUNT(*) FILTER (WHERE a.format = 'highlight') AS highlights_count
  FROM reading_group_memberships rgm
  LEFT OUTER JOIN annotations a ON a.creator_id = rgm.user_id AND a.reading_group_id = rgm.reading_group_id
  GROUP BY rgm.id
