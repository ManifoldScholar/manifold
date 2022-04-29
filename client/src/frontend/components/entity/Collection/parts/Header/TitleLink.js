import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function TitleLink({ to, children, className }) {
  return !to ? (
    children
  ) : (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

TitleLink.displayName = "Frontend.Entity.Collection.Header.Title";

TitleLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  to: PropTypes.string
};

export default TitleLink;
