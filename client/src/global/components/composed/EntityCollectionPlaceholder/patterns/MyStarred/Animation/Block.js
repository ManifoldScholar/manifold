import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

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
    <Styled.Block>
      <Styled.TypeIcon>
        <IconComposer icon={icon} size="default" />
      </Styled.TypeIcon>
      <Styled.CollectingIcon>
        <IconComposer icon="StarFillUnique" size="default" />
      </Styled.CollectingIcon>
      <Styled.BlockTitle>{title}</Styled.BlockTitle>
    </Styled.Block>
  );
}

Block.displayName = "CollectingAnimation.Block";

Block.propTypes = {
  type: PropTypes.string.isRequired
};

export default Block;
