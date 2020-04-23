SELECT
	ur.user_id || ':' || r.resource_id || ':' || r.resource_type AS id,
	ur.user_id AS user_id,
	r.resource_id AS resource_id,
	r.resource_type AS resource_type,
	array_agg(r.name) AS role_names
	FROM roles r
	INNER JOIN users_roles ur ON ur.role_id = r.id
	WHERE r.kind = 'scoped'
	GROUP BY ur.user_id, r.resource_id, r.resource_type
	HAVING r.resource_id IS NOT NULL AND r.resource_type IS NOT NULL
