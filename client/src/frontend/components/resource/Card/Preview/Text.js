import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function getContentForKind(resource) {
  const { kind, downloadable } = resource.attributes;

  if (!downloadable) {
    switch (kind.toLowerCase()) {
      case "link":
        return {
          text: "Visit",
          icon: "arrowRight16",
          iconSize: "default"
        };
      default:
        return {
          text: "View",
          icon: "arrowRight16",
          iconSize: "default"
        };
    }
  }

  switch (kind.toLowerCase()) {
    case "image":
    case "interactive":
      return {
        text: "Preview",
        icon: "eyeOpen16",
        iconSize: 21.333
      };
    case "video":
      return {
        text: "Play",
        icon: "play16",
        iconSize: 19.2
      };
    default:
      return {
        text: "Download",
        icon: "arrowDown16",
        iconSize: "default"
      };
  }
}

function Text({ resource }) {
  const { text, icon, iconSize } = getContentForKind(resource);
  const { title, kind } = resource.attributes;

  return (
    <>
      <span className="resource-card__view-text" aria-hidden>
        {text}
      </span>
      <span className="screen-reader-text">{`${text} ${kind} “${title}”`}</span>
      <IconComposer
        icon={icon}
        size={iconSize}
        iconClass="resource-card__view-icon"
      />
    </>
  );
}

Text.displayName = "ResourceCard.Preview.Text";

Text.propTypes = {
  resource: PropTypes.object.isRequired
};

export default Text;
