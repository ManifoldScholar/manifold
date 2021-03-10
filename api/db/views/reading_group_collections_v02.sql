WITH category_type_ids AS (
  SELECT
    x.reading_group_id,
    COALESCE(x.reading_group_category_id::text, '$uncategorized$') AS category_id,
    x.collectable_jsonapi_type,
    jsonb_agg(x.collectable_id ORDER BY x.position ASC) AS ids
    FROM reading_group_composite_entry_rankings x
    GROUP BY 1, 2, 3
), category_mappings AS (
  SELECT
    cti.reading_group_id,
    cti.category_id,
    jsonb_object_agg(cti.collectable_jsonapi_type, cti.ids) AS mapping
    FROM category_type_ids cti
    GROUP BY 1, 2
), collection_mappings AS (
  SELECT
    cm.reading_group_id,
    jsonb_object_agg(cm.category_id, cm.mapping) AS mapping
    FROM category_mappings cm
    GROUP BY 1
), category_lists AS (
  SELECT
    rgc.reading_group_id AS reading_group_id,
    jsonb_agg(
      jsonb_build_object(
        'id', rgc.id,
        'title', rgc.fa_cache -> 'title',
        'description', rgc.fa_cache -> 'description',
        'position', rgc.position
      )
      ORDER BY rgc.position
    ) AS categories
  FROM reading_group_categories rgc
  GROUP BY 1
)
SELECT rg.id::text || '-collection' AS id,
  rg.id AS reading_group_id,
  COALESCE(cl.categories, '[]'::jsonb) AS categories,
  COALESCE(cm.mapping, '{}'::jsonb) AS category_mappings
FROM reading_groups rg
LEFT OUTER JOIN category_lists cl ON cl.reading_group_id = rg.id
LEFT OUTER JOIN collection_mappings cm ON cm.reading_group_id = rg.id
;
