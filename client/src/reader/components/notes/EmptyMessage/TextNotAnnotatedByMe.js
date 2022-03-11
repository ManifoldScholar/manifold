import React from "react";
import Template from "./Template";
import { useTranslation } from "react-i18next";

const TextNotAnnotatedByMe = () => {
  const { t } = useTranslation();

  return (
    <Template
      title={t("reader.menus.notes.no_annotations_by_me")}
      body={t("reader.menus.notes.no_annotations_by_me_message")}
    />
  );
};

export default TextNotAnnotatedByMe;
