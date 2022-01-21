import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function Drag({ dragHandleProps, onFocus, onBlur }) {
  return (
    <Styled.Action
      as="div"
      {...dragHandleProps}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <IconComposer icon="grabber32" size="default" />
      <span className="screen-reader-text">Drag item</span>
    </Styled.Action>
  );
}

Drag.displayName = "ReadingGroup.Collecting.CollectionEditor.Collectable.Drag";

Drag.propTypes = {
  dragHandleProps: PropTypes.object.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export default Drag;
