import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { journalsAPI } from "api";
import { Redirect, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom-v5-compat";
import { useFetch, useRedirectToFirstMatch } from "hooks";
import { childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export default function JournalWrapper({ route }) {
  const { id } = useParams();
  const { data: journal, response } = useFetch({
    request: [journalsAPI.show, id],
    condition: id !== "all"
  });
  const location = useLocation();
  const isHomePage = location.pathname === `/journals/${id}`;

  useRedirectToFirstMatch({
    route: "frontendJournal",
    candidates: [
      {
        label: "All Journals",
        route: "frontendJournalsAll"
      }
    ]
  });

  if (id === "all") return <Redirect to={lh.link("frontendJournalsList")} />;

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
