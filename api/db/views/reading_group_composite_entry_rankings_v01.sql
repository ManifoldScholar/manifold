SELECT rgce.id AS reading_group_composite_entry_id,
  rgce.reading_group_id,
  rgce.reading_group_category_id,
  rgce.collectable_type,
  rgce.collectable_id,
  rgce.collectable_jsonapi_type,
  rgc.position AS category_position,
  COALESCE(rgep.position, rger.position, rgerc.position, rget.position) AS position
FROM reading_group_composite_entries rgce
LEFT OUTER JOIN reading_group_categories rgc ON rgce.reading_group_category_id = rgc.id
LEFT OUTER JOIN reading_group_projects rgep ON rgce.reading_group_project_id = rgep.id
LEFT OUTER JOIN reading_group_resources rger ON rgce.reading_group_resource_id = rger.id
LEFT OUTER JOIN reading_group_resource_collections rgerc ON rgce.reading_group_resource_collection_id = rgerc.id
LEFT OUTER JOIN reading_group_texts rget ON rgce.reading_group_text_id = rget.id
