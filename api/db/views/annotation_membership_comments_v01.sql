SELECT
  c.id AS comment_id,
  c.creator_id AS user_id,
  c.subject_id AS annotation_id,
  c.parent_id,
  a.creator_id AS annotation_user_id,
  a.reading_group_id,
  rgm.id AS reading_group_membership_id,
  rgm.aasm_state
  FROM comments c
  INNER JOIN annotations a ON a.id = c.subject_id
  INNER JOIN reading_group_memberships rgm ON rgm.reading_group_id = a.reading_group_id AND rgm.user_id = c.creator_id
  WHERE
    c.subject_type = 'Annotation'
    AND
    a.reading_group_id IS NOT NULL AND a.creator_id IS NOT NULL
    AND
    -- don't include comments that are on the owner's annotation
    -- we only use this view to fetch annotations that a user has commented
    -- that don't belong to them
    a.creator_id <> c.creator_id
;
