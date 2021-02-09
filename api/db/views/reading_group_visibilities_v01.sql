SELECT rg.id AS reading_group_id,
  rgm.id AS reading_group_membership_id,
  u.id AS user_id,
  rg.privacy,
  rgm.id IS NULL AND rg.privacy = 'public' AS joinable,
  rgm.id IS NOT NULL AND rgm.aasm_state = 'active' AS joined,
  rgm.id IS NOT NULL AND rgm.aasm_state = 'archived' AS archived,
  (rgm.id IS NULL AND rg.privacy = 'public') OR (rgm.id IS NOT NULL AND rgm.aasm_state = 'active') AS visible,
  rg.creator_id = u.id AS created
  FROM users u
  CROSS JOIN reading_groups rg
  LEFT OUTER JOIN reading_group_memberships rgm ON rgm.reading_group_id = rg.id AND rgm.user_id = u.id
;
