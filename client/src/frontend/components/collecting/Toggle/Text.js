import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";

function determineText(view, t) {
  switch (view) {
    case "remove-active":
      return {
        key: "remove",
        text: t("actions.remove")
      };
    case "remove-confirm":
    case "remove-confirm-active":
      return {
        key: "remove-confirm",
        text: t("messages.confirm")
      };
    case "add-active":
      return {
        key: "add",
        text: t("actions.add")
      };
    default:
      return {
        key: "empty",
        text: ""
      };
  }
}

function ToggleText({ view }) {
  const { t } = useTranslation();

  const transitionProps = {
    mountOnEnter: true,
    classNames: "collecting-toggle__text",
    timeout: { enter: 0, exit: 200 }
  };

  const { key, text } = determineText(view, t);

  return (
    <ReactTransitionGroup>
      <CSSTransition key={key} {...transitionProps}>
        <span className="collecting-toggle__text">{text}</span>
      </CSSTransition>
    </ReactTransitionGroup>
  );
}

ToggleText.displayName = "Collecting.Toggle.Text";

ToggleText.propTypes = {
  view: PropTypes.string
};

export default ToggleText;
