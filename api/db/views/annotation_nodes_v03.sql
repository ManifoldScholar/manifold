SELECT DISTINCT ON (a.id)
  a.id AS annotation_id,
  a.text_section_id AS text_section_id,
  ancestor_node.id AS ancestor_node_id,
  start_node.id AS start_node_id,
  end_node.id AS end_node_id,
  ts.body_json #> ancestor_node.path AS existing_node,
  ts.id IS NOT NULL AS matches_text_section,
  start_node.extrapolated_at AS start_node_extrapolated_at,
  end_node.extrapolated_at AS end_node_extrapolated_at,
  ancestor_node.extrapolated_at AS ancestor_node_extrapolated_at
  FROM annotations a
  LEFT OUTER JOIN text_section_nodes start_node ON start_node.text_section_id = a.text_section_id AND start_node.node_uuid = a.start_node
  LEFT OUTER JOIN text_section_nodes end_node ON end_node.text_section_id = a.text_section_id AND end_node.node_uuid = a.end_node
  LEFT OUTER JOIN text_section_nodes ancestor_node ON ancestor_node.node_path @> start_node.node_path AND ancestor_node.node_path @> end_node.node_path AND NOT ancestor_node.intermediate
  LEFT OUTER JOIN text_sections ts ON ts.id = a.text_section_id AND ts.body_hash = ancestor_node.body_hash
  ORDER BY a.id, ancestor_node.extrapolated_at DESC NULLS LAST, ancestor_node.depth DESC NULLS LAST
;
