import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { journalIssuesAPI } from "api";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";
import { useFetch } from "hooks";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export default function IssueWrapper({ route }) {
  const { id } = useParams();
  const { data: issue, response } = useFetch({
    request: [journalIssuesAPI.show, id]
  });
  const { path } = useRouteMatch();
  const location = useLocation();
  const isHomePage = location.pathname === path;

  return (
    <>
      {issue && <EventTracker event={EVENTS.VIEW_RESOURCE} resource={issue} />}
      <CheckFrontendMode
        debugLabel="IssueWrapper"
        project={issue}
        isProjectHomePage={isHomePage}
      />
      <RedirectToFirstMatch
        from={lh.link("frontendIssue")}
        candidates={[
          {
            label: "All Issues",
            route: "frontendIssuesList"
          }
        ]}
      />
      {childRoutes(route, {
        childProps: {
          issue,
          response
        }
      })}
    </>
  );
}

IssueWrapper.displayName = "Frontend.Containers.IssueWrapper";

IssueWrapper.propTypes = {
  route: PropTypes.object
};
