SELECT a.id AS annotation_id,
  a.reading_group_id AS reading_group_id,
  a.creator_id AS user_id,
  rgm.id AS reading_group_membership_id,
  rgm.aasm_state
  FROM annotations AS a
  LEFT OUTER JOIN reading_group_memberships AS rgm ON rgm.reading_group_id = a.reading_group_id AND rgm.user_id = a.creator_id
  WHERE a.creator_id IS NOT NULL AND a.reading_group_id IS NOT NULL
