import React from "react";
import PropTypes from "prop-types";

function Remove({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="collection-category-builder__action collection-category-builder__action--padded"
    >
      Remove
    </button>
  );
}

Remove.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Collectable.Remove";

Remove.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default Remove;
