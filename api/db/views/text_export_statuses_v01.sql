SELECT t.id AS text_id,
  te.id AS text_export_id,
  CASE te.export_kind
  WHEN 'epub_v3' THEN t.export_configuration @> '{"epub_v3":true}'::jsonb
  ELSE
    FALSE
  END AS autoexport,
  te.export_kind,
  te.fingerprint AS export_fingerprint,
  t.fingerprint = te.fingerprint AS current,
  t.fingerprint <> te.fingerprint AS stale,
  te.created_at AS exported_at
  FROM texts t
  INNER JOIN text_exports te ON t.id = te.text_id
