SELECT user_id, entitlement_role_id, resource_id, resource_type, role_name, role_kind,
  COALESCE(
    (
      array_agg(current_state ORDER BY cs.position)
    )[1],
    'pending'
  ) AS current_state,
  bool_and(expired) AS expired,
  bool_and(inferred) AS inferred,
  bool_or(expired) AS has_ever_been_expired,
  bool_or(inferred) AS has_ever_been_inferred,
  COUNT(DISTINCT entitlement_id) FILTER (WHERE current_state = 'active') AS active_entitlements_count,
  COUNT(DISTINCT entitlement_id) FILTER (WHERE current_state = 'expiring_soon') AS expiring_soon_entitlements_count,
  COUNT(DISTINCT entitlement_id) FILTER (WHERE current_state = 'expired') AS expired_entitlements_count,
  MIN(granted_at) AS first_granted_at,
  MAX(expired_at) AS last_expired_at,
  jsonb_agg(DISTINCT s.summary) AS summaries
  FROM entitlement_derived_roles
  LEFT JOIN LATERAL (
    SELECT
      CASE current_state
      WHEN 'active' THEN 1
      WHEN 'expiring_soon' THEN 2
      WHEN 'expired' THEN 3
      ELSE
        5
      END AS position
  ) cs ON true
  LEFT JOIN LATERAL (
    SELECT jsonb_build_object('current_state', current_state, 'entitlement_id', entitlement_id, 'expired', expired, 'expires_on', expires_on, 'expired_at', expired_at, 'granted_at', granted_at) AS summary
    ORDER BY expired_at DESC NULLS FIRST, cs.position ASC, expires_on DESC NULLS FIRST
  ) s ON true
  GROUP BY 1, 2, 3, 4, 5, 6
