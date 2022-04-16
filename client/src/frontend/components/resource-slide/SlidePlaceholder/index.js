import React from "react";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function ResourceListSlidePlaceholder() {
  const { t } = useTranslation();
  return (
    <Styled.Placeholder
      style={{
        backgroundImage: "url(/static/images/resource-collection.jpg)"
      }}
    >
      <Styled.InfoWrapper>
        <Styled.Icon size={120} icon="resourceCollection64" />
        <Styled.Label>{t("placeholders.resource_collection")}</Styled.Label>
      </Styled.InfoWrapper>
    </Styled.Placeholder>
  );
}

ResourceListSlidePlaceholder.displayName = "ResourceList.Slide.Placeholder";
