import React from "react";
import { useTranslation } from "react-i18next";
import { Actions, Body, Title, Wrapper } from "../parts";

function FilteredAnnotationsPlaceholder({ style }) {
  const { t } = useTranslation();
  return (
    <Wrapper context="frontend" style={style}>
      <Title icon="readingGroup24">
        {t("placeholders.annotations_filtered.title")}
      </Title>
      <Body>
        <p>{t("placeholders.annotations_filtered.body")}</p>
      </Body>
      <Actions />
    </Wrapper>
  );
}

FilteredAnnotationsPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.FilteredAnnotations";

export default FilteredAnnotationsPlaceholder;
