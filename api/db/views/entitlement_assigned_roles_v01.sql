SELECT ur.user_id, er.id AS entitlement_role_id, r.resource_id AS resource_id, r.resource_type, r.name AS role_name, r.id AS role_id
  FROM roles r
  INNER JOIN entitlement_roles er ON r.name = er.name
  INNER JOIN users_roles ur ON ur.role_id = r.id
;
