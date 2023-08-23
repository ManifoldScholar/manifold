import React from "react";
import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";
import { useRedirectToFirstMatch } from "hooks";

export default function JournalsWrapper({ route }) {
  useRedirectToFirstMatch({
    route: "frontendJournals",
    candidates: [
      {
        label: "All Journals",
        route: "frontendJournalsList"
      }
    ]
  });

  return renderRoutes(route.routes);
}

JournalsWrapper.propTypes = {
  route: PropTypes.object
};
