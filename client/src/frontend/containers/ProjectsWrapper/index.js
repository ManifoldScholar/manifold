import React from "react";
import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";
import { useRedirectToFirstMatch } from "hooks";

export default function ProjectsWrapper({ route }) {
  useRedirectToFirstMatch({
    route: "frontendProjects",
    candidates: [
      {
        label: "All Projects",
        route: "frontendProjectsAll"
      }
    ]
  });

  return renderRoutes(route.routes);
}
