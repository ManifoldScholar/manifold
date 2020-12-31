SELECT
  text_id,
  jsonb_object_agg(kind, (jsonb_build_object('raw', value) || (fa_cache -> 'value')) ORDER BY created_at DESC) AS titles
  FROM text_titles
  WHERE kind IS NOT NULL
  GROUP BY text_id
;
