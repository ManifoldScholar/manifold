SELECT
    p.id AS id,
    p.id AS project_id,
    p.title,
    p.fa_cache #>> '{title,formatted}' AS title_formatted,
    p.fa_cache #>> '{title,plaintext}' AS title_plaintext,
    p.subtitle,
    p.fa_cache #>> '{subtitle,formatted}' AS subtitle_formatted,
    p.fa_cache #>> '{subtitle,plaintext}' AS subtitle_plaintext,
    p.publication_date,
    p.created_at,
    p.updated_at,
    p.slug,
    p.avatar_color,
    p.avatar_data,
    p.draft,
    p.finished,
    pm.creator_names AS creator_names
  FROM projects p
  LEFT JOIN LATERAL (
    SELECT
      (string_agg(m.cached_full_name, ', ' ORDER BY c.position ASC) FILTER (WHERE role = 'creator')) AS creator_names,
      (string_agg(m.cached_full_name, ', ' ORDER BY c.position ASC) FILTER (WHERE role = 'collaborator')) AS collaborator_names
    FROM collaborators c
    INNER JOIN makers m ON m.id = c.maker_id
    WHERE c.collaboratable_type = 'Project' AND c.collaboratable_id = p.id
  ) pm ON true
;
