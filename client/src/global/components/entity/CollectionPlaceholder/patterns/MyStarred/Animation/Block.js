import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function getContent(type, t) {
  switch (type) {
    case "projects":
      return {
        title: t("glossary.project_title_case_other"),
        icon: "projects64"
      };
    case "texts":
      return {
        title: t("glossary.text_title_case_other"),
        icon: "textsStacked64"
      };
    case "textSections":
      return {
        title: t("glossary.text_section_title_case_other"),
        icon: "toc64"
      };
    case "resourceCollections":
      return {
        title: t("glossary.resource_collection_title_case_other"),
        icon: "resourceCollection64"
      };
    case "resources":
      return {
        title: t("glossary.resource_title_case_other"),
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
