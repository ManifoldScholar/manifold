import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function ContentSkeleton({ nested, style }) {
  return <Styled.Skeleton $nested={nested} style={style} />;
}

ContentSkeleton.displayName = "ReadingGroup.Collecting.ContentSkeleton";

ContentSkeleton.propTypes = {
  nested: PropTypes.bool,
  style: PropTypes.object
};

export default ContentSkeleton;
