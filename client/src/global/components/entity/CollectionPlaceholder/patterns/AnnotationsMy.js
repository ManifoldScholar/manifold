import React from "react";
import { useTranslation } from "react-i18next";
import { Actions, Body, Title, Wrapper } from "../parts";

function MyAnnotationsPlaceholder() {
  const { t } = useTranslation();
  return (
    <Wrapper context="frontend">
      <Title icon="notes24">{t("placeholders.annotations_my.title")}</Title>
      <Body>
        <p>{t("placeholders.annotations_my.body")}</p>
      </Body>
      <Actions />
    </Wrapper>
  );
}

MyAnnotationsPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.MyAnnotations";

export default MyAnnotationsPlaceholder;
