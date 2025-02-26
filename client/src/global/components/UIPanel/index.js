import React from "react";
import PropTypes from "prop-types";
import { FocusTrap } from "focus-trap-react";
import * as Styled from "./styles";
import classNames from "classnames";

export default function UIPanel(props) {
  const visible = props.visibility[props.id];

  const handleOutsideClick = e => {
    const header = document.querySelector(".reader-header, .header-app");
    if (header?.contains(e.target)) {
      return true;
    }
    return props.hidePanel(e);
  };

  return (
    <FocusTrap
      active={visible}
      focusTrapOptions={{
        allowOutsideClick: handleOutsideClick,
        escapeDeactivates: e => props.hidePanel(e)
      }}
    >
      <Styled.Panel inert={!visible ? "" : undefined}>
        {React.createElement(props.bodyComponent, {
          ...props,
          closeCallback: props.hidePanel,
          className: classNames(props.bodyClassName, "panel")
        })}
      </Styled.Panel>
    </FocusTrap>
  );
}

UIPanel.displayName = "Global.UIPanel";

UIPanel.propTypes = {
  id: PropTypes.string,
  visibility: PropTypes.object,
  bodyComponent: PropTypes.elementType,
  hidePanel: PropTypes.func
};
