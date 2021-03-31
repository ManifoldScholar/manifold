import React from "react";
import PropTypes from "prop-types";
import Category from "./Category";
import { getMappingsForCollectionCategory } from "frontend/components/collecting/helpers";

const CategoriesList = React.memo(function CategoriesList({
  collection,
  categories,
  responses,
  onCollectableRemove,
  activeType
}) {
  return categories.map(({ id, ...restProps }, index) => (
    <Category
      key={id}
      id={id}
      index={index}
      mappings={getMappingsForCollectionCategory(collection, id)}
      responses={responses}
      onCollectableRemove={onCollectableRemove}
      activeType={activeType}
      {...restProps}
    />
  ));
});

CategoriesList.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCategories.CategoriesList";

CategoriesList.propTypes = {
  collection: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  responses: PropTypes.object.isRequired,
  onCollectableRemove: PropTypes.func.isRequired,
  activeType: PropTypes.string
};

export default CategoriesList;
