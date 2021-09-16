import React from "react";
import PropTypes from "prop-types";
import withConfirmation from "hoc/with-confirmation";

function Remove({ id, type, onRemove, confirm }) {
  function handleClick() {
    const heading =
      "Are you sure you want to remove this item from your collection?";
    const message = "This action cannot be undone.";
    confirm(heading, message, () => onRemove({ id, type }));
  }

  return (
    <button
      onClick={handleClick}
      className="group-collection-editor__action group-collection-editor__action--padded"
    >
      <span>Remove</span>
      <span className="screen-reader-text">item</span>
    </button>
  );
}

Remove.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Collectable.Remove";

Remove.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(Remove);
