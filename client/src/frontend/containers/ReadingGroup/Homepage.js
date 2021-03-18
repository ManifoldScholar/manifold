import React from "react";
import PropTypes from "prop-types";
import CollectionPlaceholder from "frontend/components/collecting/reading-group/CollectionPlaceholder";
import CollectionCategory from "frontend/components/collecting/reading-group/CollectionCategory";
import {
  getEntityCollection,
  getCollectionCategories,
  getMappingsForCollectionCategory
} from "frontend/components/collecting/helpers";
import {
  useDispatchReadingGroupCollected,
  useSelectReadingGroupCollected
} from "hooks";

function ReadingGroupHomepageContainer({ readingGroup }) {
  const groupId = readingGroup.id;

  useDispatchReadingGroupCollected(groupId, "projects");
  useDispatchReadingGroupCollected(groupId, "texts");
  useDispatchReadingGroupCollected(groupId, "text_sections");
  useDispatchReadingGroupCollected(groupId, "resource_collections");
  useDispatchReadingGroupCollected(groupId, "resources");

  const responses = {
    projects: useSelectReadingGroupCollected("projects"),
    texts: useSelectReadingGroupCollected("texts"),
    textSections: useSelectReadingGroupCollected("text_sections"),
    resourceCollections: useSelectReadingGroupCollected("resource_collections"),
    resources: useSelectReadingGroupCollected("resources")
  };

  const collection = getEntityCollection(readingGroup);
  const categories = getCollectionCategories(collection);
  const uncategorizedMappings = getMappingsForCollectionCategory(
    collection,
    "$uncategorized$"
  );

  const hasPopulatedCategories = categories.length > 0;
  const hasUncategorized = !!uncategorizedMappings;
  const showPlaceholder = !hasPopulatedCategories && !hasUncategorized;

  return (
    <div style={{ marginTop: 60 }}>
      {hasPopulatedCategories &&
        categories.map(({ id, ...restProps }) => (
          <CollectionCategory
            key={id}
            mappings={getMappingsForCollectionCategory(collection, id)}
            responses={responses}
            {...restProps}
          />
        ))}
      {hasUncategorized && (
        <CollectionCategory
          title={{ plaintext: "Uncategorized" }}
          mappings={uncategorizedMappings}
          responses={responses}
        />
      )}
      {showPlaceholder && <CollectionPlaceholder />}
    </div>
  );
}

ReadingGroupHomepageContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default ReadingGroupHomepageContainer;
