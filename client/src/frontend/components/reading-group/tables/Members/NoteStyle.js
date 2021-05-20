import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function NoteStyle({ membership }) {
  const { annotationStyle } = membership.attributes;

  const className = classNames({
    "table__inline-value": true,
    "table__inline-value--underlined": true,
    [`underline-${annotationStyle}`]: true
  });

  return <span className={className}>{annotationStyle}</span>;
}

NoteStyle.displayName = "MembersTable.Member.NoteStyle";

NoteStyle.propTypes = {
  membership: PropTypes.object.isRequired
};

export default NoteStyle;
