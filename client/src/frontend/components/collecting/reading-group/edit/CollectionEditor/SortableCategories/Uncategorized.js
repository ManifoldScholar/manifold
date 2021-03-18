import React from "react";
import PropTypes from "prop-types";
import Category from "./Category";

const CATEGORY_ID = "$uncategorized$";

function Uncategorized(props) {
  const category = { id: CATEGORY_ID, attributes: { title: "Uncategorized" } };

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
