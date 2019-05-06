SELECT
  cp.id AS collection_project_id,
  cp.project_collection_id,
  cp.project_id,
  rank() OVER outer_w AS ranking,
  rank() OVER global_w AS global_ranking,
  pc.sort_order,
  sv.sort_order AS dynamic_sort_order,
  dsv.dynamic_sort_value,
  manual.ranking AS manual_sort_value
  FROM collection_projects cp
  INNER JOIN project_collections pc ON pc.id = cp.project_collection_id
  INNER JOIN projects p ON p.id = cp.project_id
  LEFT JOIN LATERAL (
    SELECT cp.position AS ranking WHERE pc.sort_order = 'manual'
  ) manual ON pc.sort_order = 'manual'
  LEFT OUTER JOIN project_collection_sort_orders sv ON pc.sort_order <> 'manual' AND pc.sort_order = sv.sort_order
  LEFT JOIN LATERAL (
    SELECT CASE sv.column_name
    WHEN 'created_at' THEN p.created_at::text
    WHEN 'updated_at' THEN p.updated_at::text
    WHEN 'publication_date' THEN p.publication_date::text
    WHEN 'title' THEN p.title
    ELSE
      p.title
    END AS dynamic_sort_value
  ) AS dsv ON pc.sort_order <> 'manual'
  WINDOW
    outer_w AS (
      PARTITION BY cp.project_collection_id
      ORDER BY
        CASE WHEN pc.sort_order = 'manual' THEN manual.ranking END ASC NULLS LAST,
        CASE WHEN sv.descending THEN dsv.dynamic_sort_value END DESC,
        CASE WHEN sv.ascending THEN dsv.dynamic_sort_value END ASC
    ),
    global_w AS (
      ORDER BY pc.position NULLS LAST,
        CASE WHEN pc.sort_order = 'manual' THEN manual.ranking END ASC NULLS LAST,
        CASE WHEN sv.descending THEN dsv.dynamic_sort_value END DESC,
        CASE WHEN sv.ascending THEN dsv.dynamic_sort_value END ASC
    )
;
