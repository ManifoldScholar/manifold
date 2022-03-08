import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import { capitalize } from "utils/string";
import * as Styled from "./styles";

function getContent(type, t) {
  switch (type) {
    case "projects":
      return {
        title: capitalize(t("glossary.project_other")),
        icon: "projects64"
      };
    case "texts":
      return {
        title: capitalize(t("glossary.text_other")),
        icon: "textsStacked64"
      };
    case "textSections":
      return {
        title: capitalize(t("glossary.text_section_other"), true),
        icon: "toc64"
      };
    case "resourceCollections":
      return {
        title: capitalize(t("glossary.resource_collection_other"), true),
        icon: "resourceCollection64"
      };
    case "resources":
      return {
        title: capitalize(t("glossary.resource_other")),
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
  const { t } = useTranslation();
  const { title, icon } = getContent(type, t);

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
