SELECT
  parent.text_section_id,
  parent.id AS parent_id,
  child.id AS child_id,
  parent.depth AS parent_depth,
  parent.node_index AS parent_node_index,
  child.depth AS child_depth,
  child.node_index AS child_node_index
  FROM text_section_nodes parent
  INNER JOIN text_section_nodes child ON parent.text_section_id = child.text_section_id AND parent.node_path @> child.node_path AND child.depth > parent.depth
