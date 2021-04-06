SELECT
    t.project_id,
    t.id AS id,
    t.id AS text_id,
    t.created_at,
    t.updated_at,
    t.published,
    t.slug,
    t.category_id,
    t.position,
    t.description,
    t.fa_cache #>> '{description,formatted}' AS description_formatted,
    t.fa_cache #>> '{description,plaintext}' AS description_plaintext,
    t.start_text_section_id,
    t.publication_date,
    t.cover_data,
    t.toc,
    t.ignore_access_restrictions,
    tb.id as toc_section,
    tts.titles #>> '{subtitle,raw}' AS subtitle,
    tts.titles #>> '{subtitle,formatted}' AS subtitle_formatted,
    tts.titles #>> '{subtitle,plaintext}' AS subtitle_plaintext,
    tts.titles #>> '{main,raw}' AS title,
    tts.titles #>> '{main,formatted}' AS title_formatted,
    tts.titles #>> '{main,plaintext}' AS title_plaintext,
    tts.titles AS titles,
    tm.creator_names AS creator_names,
    tm.collaborator_names AS collaborator_names,
    COALESCE(tac.annotations_count, 0) AS annotations_count,
    COALESCE(tac.highlights_count, 0) AS highlights_count,
    COALESCE(tac.orphaned_annotations_count, 0) AS orphaned_annotations_count,
    COALESCE(tac.orphaned_highlights_count, 0) AS orphaned_highlights_count
  FROM texts t
  LEFT JOIN LATERAL (
    SELECT
      COUNT(*) FILTER (WHERE a.format = 'annotation' AND NOT orphaned) AS annotations_count,
      COUNT(*) FILTER (WHERE a.format = 'annotation' AND orphaned) AS orphaned_annotations_count,
      COUNT(*) FILTER (WHERE a.format = 'highlight' AND NOT orphaned) AS highlights_count,
      COUNT(*) FILTER (WHERE a.format = 'highlight' AND orphaned) AS orphaned_highlights_count
    FROM annotations a
    INNER JOIN text_sections ts ON ts.id = a.text_section_id
    WHERE ts.text_id = t.id
  ) tac ON true
  LEFT OUTER JOIN text_title_summaries tts ON t.id = tts.text_id
  LEFT JOIN LATERAL (
    SELECT id
    FROM text_sections ts
    WHERE ts.text_id = t.id AND ts.kind = 'navigation'
    ORDER BY created_at ASC
    LIMIT 1
  ) tb ON true
  LEFT JOIN LATERAL (
    SELECT
      (string_agg(m.cached_full_name, ', ' ORDER BY c.position ASC) FILTER (WHERE role = 'creator')) AS creator_names,
      (string_agg(m.cached_full_name, ', ' ORDER BY c.position ASC) FILTER (WHERE role = 'collaborator')) AS collaborator_names
    FROM collaborators c
    INNER JOIN makers m ON m.id = c.maker_id
    WHERE c.collaboratable_type = 'Text' AND c.collaboratable_id = t.id
  ) tm ON true
;
