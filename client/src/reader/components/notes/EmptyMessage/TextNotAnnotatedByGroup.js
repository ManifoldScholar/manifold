import React from "react";
import PropTypes from "prop-types";
import Template from "./Template";

const TextNotAnnotatedByGroup = ({ readingGroup }) => {
  const name = readingGroup?.attributes.name || "This group";
  return (
    <Template
      title={`${name} hasn't annotated this text yet`}
      body="Once someone in the group has highlighted or annotated a passage in this text, it will
          appear here. To annotate or highlight, select a passage from the text
          and click the appropriate button on the pop-up menu."
    />
  );
};

TextNotAnnotatedByGroup.propTypes = {
  readingGroup: PropTypes.object
};

export default TextNotAnnotatedByGroup;
