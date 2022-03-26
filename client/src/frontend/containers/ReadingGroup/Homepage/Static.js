import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  CollectionCategory,
  CollectionPlaceholder
} from "frontend/components/collecting/reading-group";
import { getEntityCollection } from "frontend/components/collecting/helpers";

function ReadingGroupHomepageStaticContainer({
  readingGroup,
  categories,
  responses,
  refresh
}) {
  const { t } = useTranslation();

  function handleUncollect(collection) {
    if (collection.id === readingGroup.id) refresh();
  }

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
      title: t("common.uncategorized_title_case")
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
            onUncollect={handleUncollect}
          />
        ))}
      {hasUncategorized && (
        <CollectionCategory
          category={uncategorized}
          mappings={collection.attributes.categoryMappings}
          responses={responses}
          onUncollect={handleUncollect}
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
  history: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
};

export default ReadingGroupHomepageStaticContainer;
