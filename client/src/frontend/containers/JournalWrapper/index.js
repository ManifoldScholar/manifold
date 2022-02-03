import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { journalsAPI } from "api";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";
import { useFetch } from "hooks";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export default function JournalWrapper({ route }) {
  const { id } = useParams();
  const { data: journal, response } = useFetch({
    request: [journalsAPI.show, id]
  });
  const { path } = useRouteMatch();
  const location = useLocation();
  const isHomePage = location.pathname === path;

  return (
    <>
      {journal && (
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={journal} />
      )}
      <CheckFrontendMode
        debugLabel="JournalWrapper"
        project={journal}
        isProjectHomePage={isHomePage}
      />
      <RedirectToFirstMatch
        from={lh.link("frontendJournal")}
        candidates={[
          {
            label: "All Journals",
            route: "frontendJournalsAll"
          }
        ]}
      />
      {childRoutes(route, {
        childProps: {
          journal,
          response
        }
      })}
    </>
  );
}

JournalWrapper.displayName = "Frontend.Containers.JournalWrapper";

JournalWrapper.propTypes = {
  route: PropTypes.object
};
