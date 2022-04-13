import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function Tag({ children, className }) {
  if (!children) return null;

  return <Styled.Tag className={className}>{children}</Styled.Tag>;
}

Tag.displayName = "Global.Atomic.Tag";

Tag.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Tag;
