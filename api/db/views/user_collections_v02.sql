WITH category_type_ids AS (
  SELECT
    x.user_id,
    '$uncategorized$' AS category_id,
    x.collectable_jsonapi_type,
    jsonb_agg(x.collectable_id ORDER BY x.created_at DESC) AS ids
    FROM user_collected_composite_entries x
    GROUP BY 1, 2, 3
), category_mappings AS (
  SELECT
    cti.user_id,
    cti.category_id,
    jsonb_object_agg(cti.collectable_jsonapi_type, cti.ids) AS mapping
    FROM category_type_ids cti
    GROUP BY 1, 2
), collection_mappings AS (
  SELECT
    cm.user_id,
    jsonb_object_agg(cm.category_id, cm.mapping) AS mapping
    FROM category_mappings cm
    GROUP BY 1
)
SELECT u.id::text || '-collection' AS id,
  u.id AS user_id,
  '[]'::jsonb AS categories,
  COALESCE(cm.mapping, '{}'::jsonb) AS category_mappings
FROM users u
LEFT OUTER JOIN collection_mappings cm ON cm.user_id = u.id
;
