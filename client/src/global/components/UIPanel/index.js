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
            clickOutsideDeactivates: e => props.hidePanel(e),
            escapeDeactivates: e => props.hidePanel(e)
          }}
        >
          <div>
            <button className="screen-reader-text" onClick={props.hidePanel}>
              Close Panel
            </button>
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
