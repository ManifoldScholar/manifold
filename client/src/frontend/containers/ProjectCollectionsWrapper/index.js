import React from "react";
import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";

export default function ProjectCollectionsWrapper({ route }) {
  return renderRoutes(route.routes);
}
