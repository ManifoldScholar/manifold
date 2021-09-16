import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function Drag({ dragHandleProps, onFocus, onBlur }) {
  return (
    <div
      {...dragHandleProps}
      onFocus={onFocus}
      onBlur={onBlur}
      className="group-collection-editor__action"
    >
      <IconComposer icon="grabber32" size="default" />
      <span className="screen-reader-text">Drag item</span>
    </div>
  );
}

Drag.displayName = "ReadingGroup.Collecting.CollectionEditor.Collectable.Drag";

Drag.propTypes = {
  dragHandleProps: PropTypes.object.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export default Drag;
