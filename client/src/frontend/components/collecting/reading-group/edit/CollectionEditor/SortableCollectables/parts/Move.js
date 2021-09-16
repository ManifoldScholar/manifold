import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function Move({ onClick, direction = "up", onFocus, onBlur }) {
  const icon = direction === "down" ? "arrowDown32" : "arrowUp32";
  return (
    <button
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      className="group-collection-editor__action"
    >
      <IconComposer icon={icon} size="default" />
      <span className="screen-reader-text">{`Move item ${direction} one category`}</span>
    </button>
  );
}

Move.displayName = "ReadingGroup.Collecting.CollectionEditor.Collectable.Move";

Move.propTypes = {
  onClick: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export default Move;
