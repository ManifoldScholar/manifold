SELECT ent.user_id, ent.id AS entitlement_id, ent.created_at AS granted_at,
  COALESCE(most_recent_entitlement_transition.to_state, 'pending') AS current_state,
  r.*,
  ent.expires_on, ent.expired_at, ent.expired_at IS NOT NULL AS expired
  FROM user_entitlements ent
  LEFT OUTER JOIN entitlement_transitions AS most_recent_entitlement_transition ON ent.id = most_recent_entitlement_transition.entitlement_id AND most_recent_entitlement_transition.most_recent = TRUE
  LEFT JOIN LATERAL (
    SELECT er.id AS entitlement_role_id, er.name AS role_name, er.kind AS role_kind, ent.subject_id AS resource_id, ent.subject_type AS resource_type, FALSE AS inferred
      FROM jsonb_each(ent.global_roles) AS t(name, value)
      INNER JOIN entitlement_roles er USING (name)
      WHERE value = to_jsonb(TRUE)
    UNION ALL
    SELECT er.id AS entitlement_role_id, er.name AS role_name, er.kind AS role_kind, ent.subject_id AS resource_id, ent.subject_type AS resource_type, FALSE AS inferred
      FROM jsonb_each(ent.scoped_roles) AS t(name, value)
      INNER JOIN entitlement_roles er USING (name)
      WHERE value = to_jsonb(TRUE)
    UNION ALL
    SELECT er.id AS entitlement_role_id, er.name AS role_name, er.kind AS role_kind, cp.project_id AS resource_id, 'Project' AS resource_type, TRUE AS inferred
      FROM jsonb_each(ent.scoped_roles) AS t(name, value)
      INNER JOIN entitlement_roles er USING (name)
      INNER JOIN collection_projects cp ON cp.project_collection_id = ent.subject_id
      WHERE ent.subject_type = 'ProjectCollection' AND value = to_jsonb(TRUE)
    UNION ALL
    SELECT er.id AS entitlement_role_id, er.name AS role_name, er.kind AS role_kind, jpl.project_id AS resource_id, 'Project' AS resource_type, TRUE AS inferred
      FROM jsonb_each(ent.scoped_roles) AS t(name, value)
      INNER JOIN entitlement_roles er USING (name)
      INNER JOIN journal_project_links jpl ON jpl.journal_id = ent.subject_id
      WHERE ent.subject_type = 'Journal' AND value = to_jsonb(TRUE)
  ) r ON true
