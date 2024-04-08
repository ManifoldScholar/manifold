import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import FocusTrap from "focus-trap-react";

export default function UIPanel(props) {
  const visibility = props.visibility[props.id];
  const visibilityClass = classNames({
    "panel-hidden": !visibility,
    "panel-visible": visibility
  });

  const handleOutsideClick = e => {
    const header = document.querySelector(".reader-header");
    if (header?.contains(e.target)) {
      return true;
    }
    return props.hidePanel(e);
  };

  return (
    <CSSTransition
      key={props.id}
      in={visibility}
      classNames="panel"
      timeout={200}
      unmountOnExit
    >
      <div className={visibilityClass}>
        <FocusTrap
          focusTrapOptions={{
            allowOutsideClick: handleOutsideClick,
            escapeDeactivates: e => props.hidePanel(e)
          }}
        >
          <div>
            {React.createElement(props.bodyComponent, {
              ...props,
              closeCallback: props.hidePanel
            })}
          </div>
        </FocusTrap>
      </div>
    </CSSTransition>
  );
}

UIPanel.displayName = "Global.UIPanel";

UIPanel.propTypes = {
  id: PropTypes.string,
  visibility: PropTypes.object,
  bodyComponent: PropTypes.elementType,
  hidePanel: PropTypes.func
};
