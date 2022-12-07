SELECT DISTINCT ON (ji.journal_id, p.id) ji.journal_id AS journal_id, p.id AS project_id, dense_rank() OVER w AS position
  FROM journal_issues ji
  LEFT OUTER JOIN journal_volumes jv ON jv.id = ji.journal_volume_id
  INNER JOIN projects p ON p.journal_issue_id = ji.id
  WINDOW w AS (
    PARTITION BY ji.journal_id
    ORDER BY jv.number ASC NULLS FIRST, ji.sort_title ASC NULLS FIRST, p.sort_title ASC
  )
  ORDER BY ji.journal_id, p.id, jv.number ASC NULLS FIRST, ji.sort_title ASC NULLS FIRST, p.sort_title ASC
;
