import React from "react";
import PropTypes from "prop-types";
import {
  CollectionCategory,
  CollectionPlaceholder
} from "frontend/components/collecting/reading-group";
import {
  getEntityCollection,
  getCollectionCategories,
  getMappingsForCollectionCategory
} from "frontend/components/collecting/helpers";

function ReadingGroupHomepageStaticContainer({
  readingGroup,
  responses,
  history
}) {
  const collection = getEntityCollection(readingGroup);
  const categories = getCollectionCategories(collection);
  const uncategorizedMappings = getMappingsForCollectionCategory(
    collection,
    "$uncategorized$"
  );

  const hasPopulatedCategories = categories?.length > 0;
  const hasUncategorized = !!uncategorizedMappings;
  const showPlaceholder = !hasPopulatedCategories && !hasUncategorized;

  if (showPlaceholder) return <CollectionPlaceholder />;

  return (
    <>
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
    </>
  );
}

ReadingGroupHomepageStaticContainer.displayName = "ReadingGroup.HomepageStaticContainer";

ReadingGroupHomepageStaticContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default ReadingGroupHomepageStaticContainer;
