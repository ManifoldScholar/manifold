import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function ContentSkeleton({ nested, style }) {
  const className = classNames({
    "collectable-placeholder-content": true,
    "collectable-placeholder-content--nested": nested
  });
  return <div className={className} style={style} />;
}

ContentSkeleton.displayName = "ReadingGroup.Collecting.ContentSkeleton";

ContentSkeleton.propTypes = {
  nested: PropTypes.bool,
  style: PropTypes.object
};

export default ContentSkeleton;
