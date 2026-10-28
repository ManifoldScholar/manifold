import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function determineText(view, t) {
  switch (view) {
    case "remove":
    case "remove-active":
      return {
        key: "remove",
        text: t("actions.remove")
      };
    case "add":
    case "add-active":
    case "collected-active":
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

function ToggleText({ view, disclosure = false }) {
  const { t } = useTranslation();

  const { key, text } = determineText(view, t);

  return (
    <Styled.Text key={key}>
      <span>{text}</span>
      {disclosure && <Styled.Disclosure icon="disclosureDown16" size={16} />}
    </Styled.Text>
  );
}

ToggleText.displayName = "Collecting.Toggle.Text";

ToggleText.propTypes = {
  view: PropTypes.string,
  disclosure: PropTypes.bool
};

export default ToggleText;
