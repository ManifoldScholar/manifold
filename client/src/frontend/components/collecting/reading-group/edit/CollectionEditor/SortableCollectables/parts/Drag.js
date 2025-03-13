import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function Drag({ dragHandleRef, onFocus, onBlur }) {
  return (
    <Styled.Action
      as="span"
      tabIndex={0}
      ref={dragHandleRef}
      onFocus={onFocus}
      onBlur={onBlur}
      data-drag-handle
    >
      <IconComposer icon="grabber32" size="default" />
      <span className="screen-reader-text">Drag item</span>
    </Styled.Action>
  );
}

Drag.displayName = "ReadingGroup.Collecting.CollectionEditor.Collectable.Drag";

Drag.propTypes = {
  dragHandleProps: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export default Drag;
