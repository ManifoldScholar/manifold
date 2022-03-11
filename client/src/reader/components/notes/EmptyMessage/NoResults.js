import React from "react";
import Template from "./Template";
import { useTranslation } from "react-i18next";

function NoResults() {
  const { t } = useTranslation();
  return (
    <Template
      title={t("reader.menus.notes.no_annotations")}
      body={t("reader.menus.notes.no_matches_with_filters")}
    />
  );
}

export default NoResults;
