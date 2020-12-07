SELECT
    rg.id AS reading_group_id,
    COUNT(*) FILTER (WHERE a.format = 'annotation' AND NOT orphaned) AS annotations_count,
    COUNT(*) FILTER (WHERE a.format = 'annotation' AND orphaned) AS orphaned_annotations_count,
    COUNT(*) FILTER (WHERE a.format = 'highlight' AND NOT orphaned) AS highlights_count,
    COUNT(*) FILTER (WHERE a.format = 'highlight' AND orphaned) AS orphaned_highlights_count
  FROM reading_groups rg
  LEFT OUTER JOIN annotations a ON a.reading_group_id = rg.id
  GROUP BY rg.id
