import React from "react";
import PropTypes from "prop-types";
import {
  CollectionCategory,
  CollectionPlaceholder
} from "frontend/components/collecting/reading-group";
import { getEntityCollection } from "frontend/components/collecting/helpers";

function ReadingGroupHomepageStaticContainer({
  readingGroup,
  categories,
  responses
}) {
  const collection = getEntityCollection(readingGroup);
  const uncategorizedMappings =
    collection.attributes?.categoryMappings.$uncategorized$;

  const hasPopulatedCategories = categories?.length > 0;
  const hasUncategorized = !!uncategorizedMappings;
  const showPlaceholder = !hasPopulatedCategories && !hasUncategorized;

  if (showPlaceholder) return <CollectionPlaceholder />;

  const uncategorized = {
    id: "$uncategorized$",
    attributes: {
      title: "Uncategorized"
    }
  };

  return (
    <>
      {hasPopulatedCategories &&
        categories.map(category => (
          <CollectionCategory
            key={category.id}
            category={category}
            mappings={collection.attributes.categoryMappings}
            responses={responses}
          />
        ))}
      {hasUncategorized && (
        <CollectionCategory
          category={uncategorized}
          mappings={collection.attributes.categoryMappings}
          responses={responses}
        />
      )}
    </>
  );
}

ReadingGroupHomepageStaticContainer.displayName =
  "ReadingGroup.HomepageStaticContainer";

ReadingGroupHomepageStaticContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  categories: PropTypes.array,
  responses: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default ReadingGroupHomepageStaticContainer;
