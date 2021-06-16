import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function getContent(type) {
  switch (type) {
    case "projects":
      return {
        title: "Projects",
        icon: "projects64"
      };
    case "texts":
      return {
        title: "Texts",
        icon: "textsStacked64"
      };
    case "textSections":
      return {
        title: "Text Sections",
        icon: "toc64"
      };
    case "resourceCollections":
      return {
        title: "Resource Collections",
        icon: "resourceCollection64"
      };
    case "resources":
      return {
        title: "Resources",
        icon: "resources64"
      };
    default:
      return {
        title: "",
        icon: ""
      };
  }
}

function Block({ type }) {
  const { title, icon } = getContent(type);

  return (
    <div className="collecting-placeholder-animation__block">
      <div className="collecting-placeholder-animation__type-icon">
        <IconComposer icon={icon} size="default" />
      </div>
      <div className="collecting-placeholder-animation__collecting-icon">
        <IconComposer icon="StarFillUnique" size="default" />
      </div>
      <div className="collecting-placeholder-animation__block-title">
        {title}
      </div>
    </div>
  );
}

Block.displayName = "CollectingAnimation.Block";

Block.propTypes = {
  type: PropTypes.string.isRequired
};

export default Block;
