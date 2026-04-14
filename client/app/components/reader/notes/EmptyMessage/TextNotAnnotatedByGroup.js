import React from "react";
import PropTypes from "prop-types";
import Template from "./Template";
import { useTranslation } from "react-i18next";

const TextNotAnnotatedByGroup = ({ readingGroup }) => {
  const { t } = useTranslation();
  const name =
    readingGroup?.attributes.name || t("reader.menus.notes.this_group");
  return (
    <Template
      title={t("reader.menus.notes.no_group_annotations", { name })}
      body={t("reader.menus.notes.no_group_annotations_message")}
    />
  );
};

TextNotAnnotatedByGroup.propTypes = {
  readingGroup: PropTypes.object
};

export default TextNotAnnotatedByGroup;
