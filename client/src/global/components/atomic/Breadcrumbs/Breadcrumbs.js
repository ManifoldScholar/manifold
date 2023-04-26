import React from "react";
import PropTypes from "prop-types";
import Frontend from "./Frontend";
import Backend from "./Backend";

export default function Breadcrumbs({ backend, ...props }) {
  return backend ? <Backend {...props} /> : <Frontend {...props} />;
}

Breadcrumbs.displayName = "Global.Atomic.Breadcrumbs";

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  backend: PropTypes.bool,
  hideOnDesktop: PropTypes.bool
};
