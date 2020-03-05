SELECT
  ent.id,
  eul.user_id,
  eul.entitlement_id,
  ent.target_type,
  ent.target_id,
  ent.entitler_id,
  ent.subject_type,
  ent.subject_id,
  ent.expires_on,
  ent.expired_at,
  ent.kind,
  ent.description,
  ent.global_roles,
  ent.scoped_roles,
  ent.options,
  ent.metadata,
  ent.created_at,
  ent.updated_at
  FROM entitlement_user_links eul
  INNER JOIN entitlements AS ent ON ent.id = eul.entitlement_id
