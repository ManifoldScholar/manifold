import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { journalsAPI } from "api";
import {
  Redirect,
  useLocation,
  useParams,
  useRouteMatch
} from "react-router-dom";
import { useFetch, useRedirectToFirstMatch } from "hooks";
import { childRoutes } from "helpers/router";
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

  useRedirectToFirstMatch({
    route: "frontendJournal",
    candidates: [
      {
        label: "All Journals",
        route: "frontendJournalsAll"
      }
    ]
  });

  if (response?.status === 401) return <Redirect to={lh.link("frontend")} />;

  if (!journal) return null;

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={journal} />
      <CheckFrontendMode
        debugLabel="JournalWrapper"
        project={journal}
        isProjectHomePage={isHomePage}
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
