import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import withConfirmation from "hoc/with-confirmation";

function CategoryRemove({ onRemove, confirm }) {
  function handleClick() {
    const heading =
      "Are you sure you want to remove this category from your collection?";
    const message = "Any items in this category will also be deleted.";
    confirm(heading, message, () => onRemove());
  }

  return (
    <button onClick={handleClick} className="group-collection-editor__action">
      <IconComposer icon="delete32" size="default" />
      <span className="screen-reader-text">Delete category</span>
    </button>
  );
}

CategoryRemove.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Remove";

CategoryRemove.propTypes = {
  onRemove: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(CategoryRemove);
