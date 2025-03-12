import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Content from "./Category/Content";

const CATEGORY_ID = "$uncategorized$";

function Uncategorized(props) {
  const { t } = useTranslation();
  const category = {
    id: CATEGORY_ID,
    attributes: { title: t("common.uncategorized_title_case") }
  };

  return <Content category={category} {...props} />;
}

Uncategorized.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Uncategorized";

Uncategorized.propTypes = {
  mappings: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  callbacks: PropTypes.object.isRequired,
  activeType: PropTypes.string
};

export default Uncategorized;
