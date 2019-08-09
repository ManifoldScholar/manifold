SELECT
    rg.id AS reading_group_id,
    COUNT(*) FILTER (WHERE a.format = 'annotation') AS annotations_count,
    COUNT(*) FILTER (WHERE a.format = 'highlight') AS highlights_count
  FROM reading_groups rg
  LEFT OUTER JOIN annotations a ON a.reading_group_id = rg.id
  GROUP BY rg.id
