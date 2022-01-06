import React from "react";
import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";
import { RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";

export default function JournalsWrapper({ route }) {
  return (
    <>
      <RedirectToFirstMatch
        from={lh.link("frontendJournals")}
        candidates={[
          {
            label: "All Journals",
            route: "frontendJournalsList"
          }
        ]}
      />
      {renderRoutes(route.routes)}
    </>
  );
}

JournalsWrapper.propTypes = {
  route: PropTypes.object
};
