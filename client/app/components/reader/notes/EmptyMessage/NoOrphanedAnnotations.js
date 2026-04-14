import React from "react";
import Template from "./Template";
import { useTranslation } from "react-i18next";

const NoOrphanedAnnotations = () => {
  const { t } = useTranslation();

  return (
    <Template
      title={t("reader.menus.notes.no_annotations")}
      body={t("reader.menus.notes.no_orphans_message")}
    />
  );
};

export default NoOrphanedAnnotations;
