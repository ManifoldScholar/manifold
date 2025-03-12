import React from "react";
import PropTypes from "prop-types";
import Category from "./Category";

const CategoriesList = React.memo(function CategoriesList({
  categoryOrder,
  categories,
  ...restProps
}) {
  return categoryOrder.map(({ id }, index) => {
    const category = categories?.find(cat => cat.id === id);

    if (!category) return null;

    return (
      <Category
        key={id}
        id={id}
        index={index}
        category={category}
        {...restProps}
      />
    );
  });
});

CategoriesList.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCategories.CategoriesList";

CategoriesList.propTypes = {
  groupId: PropTypes.string.isRequired,
  categoryOrder: PropTypes.array.isRequired,
  mappings: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  callbacks: PropTypes.object.isRequired,
  categories: PropTypes.array,
  activeType: PropTypes.string
};

export default CategoriesList;
