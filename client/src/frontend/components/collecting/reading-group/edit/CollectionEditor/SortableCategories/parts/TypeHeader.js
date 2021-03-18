import React from "react";
import PropTypes from "prop-types";

function CategoryTypeHeader({ heading }) {
  return (
    <header>
      <h4 className="group-collection-editor__label group-collection-editor__label--collectable-type">
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
