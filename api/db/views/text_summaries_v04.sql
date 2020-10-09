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
    t.cached_description_formatted AS description_formatted,
    t.cached_description_plaintext AS description_plaintext,
    t.start_text_section_id,
    t.publication_date,
    t.cover_data,
    t.toc,
    t.ignore_access_restrictions,
    tb.id as toc_section,
    ta.subtitle,
    ta.subtitle_formatted,
    ta.subtitle_plaintext,
    ta.title,
    ta.title_formatted,
    ta.title_plaintext,
    tm.creator_names AS creator_names,
    tm.collaborator_names AS collaborator_names,
    COALESCE(tac.annotations_count, 0) AS annotations_count,
    COALESCE(tac.highlights_count, 0) AS highlights_count
  FROM texts t
  LEFT JOIN LATERAL (
    SELECT
      COUNT(*) FILTER (WHERE a.format = 'annotation') AS annotations_count,
      COUNT(*) FILTER (WHERE a.format = 'highlight') AS highlights_count
    FROM annotations a
    INNER JOIN text_sections ts ON ts.id = a.text_section_id
    WHERE ts.text_id = t.id
  ) tac ON true
  LEFT JOIN LATERAL (
    SELECT
      -- hic sunt dracones, this is not always the most efficient, but
      -- is a commonly accepted way to get "first in group" value for
      -- small-ish (<1mb) aggregations
      (array_agg(value ORDER BY created_at ASC) FILTER (WHERE kind = 'main'))[1] AS title,
      (array_agg(value ORDER BY created_at ASC) FILTER (WHERE kind = 'subtitle'))[1] AS subtitle,
      (array_agg(cached_value_formatted ORDER BY created_at ASC) FILTER (WHERE kind = 'main'))[1] AS title_formatted,
      (array_agg(cached_value_formatted ORDER BY created_at ASC) FILTER (WHERE kind = 'subtitle'))[1] AS subtitle_formatted,
      (array_agg(cached_value_plaintext ORDER BY created_at ASC) FILTER (WHERE kind = 'main'))[1] AS title_plaintext,
      (array_agg(cached_value_plaintext ORDER BY created_at ASC) FILTER (WHERE kind = 'subtitle'))[1] AS subtitle_plaintext
    FROM text_titles tt
    WHERE tt.text_id = t.id
  ) ta ON true
  LEFT JOIN LATERAL (
    SELECT
        id
    FROM text_sections ts
    WHERE ts.text_id = t.id AND ts.kind = 'navigation'
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
