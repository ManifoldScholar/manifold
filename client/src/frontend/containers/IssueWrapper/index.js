import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { useSelectIssue, useDispatchIssue } from "hooks/journals";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export default function IssueWrapper({ location, match, route }) {
  const { issue, issueResponse } = useSelectIssue(match);
  const isHomePage = location.pathname === match.url;
  useDispatchIssue(match);

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
          issueResponse
        }
      })}
    </>
  );
}

IssueWrapper.displayName = "Frontend.Containers.IssueWrapper";

IssueWrapper.propTypes = {
  route: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
};
