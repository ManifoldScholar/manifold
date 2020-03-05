SELECT
  user_id,
  entitlement_role_id,
  resource_id,
  resource_type,
  role_name,
  x.has_entitlement,
  x.has_assigned_role,
  CASE
  WHEN x.has_entitlement AND NOT x.has_assigned_role THEN 'add_role'
  WHEN NOT x.has_entitlement AND x.has_assigned_role THEN 'remove_role'
  ELSE 'skip' END AS action
  FROM entitlement_grants AS eg
  FULL OUTER JOIN entitlement_assigned_roles AS ear USING (user_id, entitlement_role_id, resource_id, resource_type, role_name)
  LEFT JOIN LATERAL (
    SELECT
      eg.summaries IS NOT NULL AND NOT eg.expired AS has_entitlement,
      ear.role_id IS NOT NULL AS has_assigned_role
  ) x ON true
;
