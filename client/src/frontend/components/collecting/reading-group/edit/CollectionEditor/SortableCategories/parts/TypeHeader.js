import React from "react";
import PropTypes from "prop-types";

function CategoryTypeHeader({ heading }) {
  return (
    <header>
      <h4 className="collection-category-builder__label collection-category-builder__label--collectable-type">
        {heading}
      </h4>
    </header>
  );
}

CategoryTypeHeader.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.CollectableTypeHeader";

CategoryTypeHeader.propTypes = {
  heading: PropTypes.string.isRequired
};

export default CategoryTypeHeader;
