import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function getContentForKind(resource, t) {
  const { kind, downloadable } = resource.attributes;

  if (!downloadable) {
    switch (kind.toLowerCase()) {
      case "link":
        return {
          text: t("actions.visit"),
          icon: "arrowRight16",
          iconSize: "default"
        };
      default:
        return {
          text: t("actions.view"),
          icon: "arrowRight16",
          iconSize: "default"
        };
    }
  }

  switch (kind.toLowerCase()) {
    case "image":
    case "interactive":
      return {
        text: t("actions.preview"),
        icon: "eyeOpen16",
        iconSize: 21.333
      };
    case "video":
      return {
        text: t("actions.play"),
        icon: "play16",
        iconSize: 19.2
      };
    default:
      return {
        text: t("actions.download"),
        icon: "arrowDown16",
        iconSize: "default"
      };
  }
}

function Text({ resource }) {
  const { t } = useTranslation();
  const { text, icon, iconSize } = getContentForKind(resource, t);
  const { title, kind } = resource.attributes;

  return (
    <>
      <Styled.Text aria-hidden>{text}</Styled.Text>
      <span className="screen-reader-text">{`${text} ${kind} “${title}”`}</span>
      <Styled.Icon icon={icon} size={iconSize} />
    </>
  );
}

Text.displayName = "ResourceCard.Preview.Text";

Text.propTypes = {
  resource: PropTypes.object.isRequired
};

export default Text;
