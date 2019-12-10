SELECT p.id AS project_id,
  pe.id AS project_export_id,
  CASE pe.export_kind
  WHEN 'bag_it' THEN p.export_configuration @> '{"bag_it":true}'::jsonb
  ELSE
    FALSE
  END AS autoexport,
  pe.export_kind,
  pe.fingerprint AS export_fingerprint,
  p.fingerprint = pe.fingerprint AS current,
  p.fingerprint <> pe.fingerprint AS stale,
  pe.created_at AS exported_at
  FROM projects p
  INNER JOIN project_exports pe ON p.id = pe.project_id
