import React from "react";
import PropTypes from "prop-types";
import Category from "./Category";
import { getMappingsForCollectionCategory } from "frontend/components/collecting/helpers";

const CategoriesList = React.memo(function CategoriesList({
  collection,
  categoryOrder,
  responses,
  onCollectableRemove,
  activeType
}) {
  const {
    attributes: { categories, categoryMappings }
  } = collection;

  return categoryOrder.map(({ id }, index) => {
    const category = categories.find(cat => cat.id === id);
    const categoryMapping = categoryMappings[id] || null;

    return (
      <Category
        key={id}
        id={id}
        index={index}
        category={category}
        categoryMapping={categoryMapping}
        responses={responses}
        onCollectableRemove={onCollectableRemove}
        activeType={activeType}
      />
    );
  });
});

CategoriesList.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCategories.CategoriesList";

CategoriesList.propTypes = {
  collection: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  onCollectableRemove: PropTypes.func.isRequired,
  activeType: PropTypes.string
};

export default CategoriesList;
