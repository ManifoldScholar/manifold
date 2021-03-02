import React from 'react';
import PropTypes from 'prop-types';
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";

function determineText(view) {
  switch(view) {
    case "remove-active":
      return {
        key: "remove",
        text: "Remove",
      };
    case "remove-confirm":
    case "remove-confirm-active":
      return {
        key: "remove-confirm",
        text: "Are you sure?"
      };
    case "add-active":
      return {
        key: "add",
        text: "Add",
      };
    default:
      return {
        key: "empty",
        text: ""
      }
  };
}

function ToggleText({ view }) {
  const transitionProps = {
    mountOnEnter: true,
    classNames: "collecting-toggle__text",
    timeout: { enter: 0, exit: 200 }
  };

  const { key, text } = determineText(view);

  return (
    <ReactTransitionGroup>
      <CSSTransition key={key} {...transitionProps}>
        <span className="collecting-toggle__text">{text}</span>
      </CSSTransition>
    </ReactTransitionGroup>
  )
}

ToggleText.displayName = "Collecting.Toggle.Text";

ToggleText.propTypes = {
  view: PropTypes.string
}

export default ToggleText;
