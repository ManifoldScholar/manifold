import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Category from "./Category";
import { capitalize } from "utils/string";

const CATEGORY_ID = "$uncategorized$";

function Uncategorized(props) {
  const { t } = useTranslation();
  const category = {
    id: CATEGORY_ID,
    attributes: { title: capitalize(t("common.uncategorized")) }
  };

  return <Category category={category} {...props} />;
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
