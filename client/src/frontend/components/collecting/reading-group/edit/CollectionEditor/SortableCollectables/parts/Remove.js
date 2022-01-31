import React from "react";
import PropTypes from "prop-types";
import withConfirmation from "hoc/withConfirmation";
import * as Styled from "./styles";

function Remove({ id, type, onRemove, confirm }) {
  function handleClick() {
    const heading =
      "Are you sure you want to remove this item from your collection?";
    const message = "This action cannot be undone.";
    confirm(heading, message, () => onRemove({ id, type }));
  }

  return (
    <Styled.ActionPadded onClick={handleClick}>
      <span>Remove</span>
      <span className="screen-reader-text">item</span>
    </Styled.ActionPadded>
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
