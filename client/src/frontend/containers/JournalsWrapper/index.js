import React from "react";
import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";

export default function JournalsWrapper({ route }) {
  return renderRoutes(route.routes);
}

JournalsWrapper.propTypes = {
  route: PropTypes.object
};
