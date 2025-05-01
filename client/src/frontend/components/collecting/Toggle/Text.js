import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function determineText(view, t) {
  switch (view) {
    case "remove-active":
      return {
        key: "remove",
        text: t("actions.remove"),
      };
    case "remove-confirm":
    case "remove-confirm-active":
      return {
        key: "remove-confirm",
        text: t("messages.confirm"),
      };
    case "add-active":
      return {
        key: "add",
        text: t("actions.add"),
      };
    default:
      return {
        key: "empty",
        text: "",
      };
  }
}

function ToggleText({ view }) {
  const { t } = useTranslation();

  const { key, text } = determineText(view, t);

  return (
    <span key={key} className="collecting-toggle__text">
      {text}
    </span>
  );
}

ToggleText.displayName = "Collecting.Toggle.Text";

ToggleText.propTypes = {
  view: PropTypes.string,
};

export default ToggleText;
