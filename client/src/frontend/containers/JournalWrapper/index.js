import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { useSelectSettings, useSelectJournal } from "hooks";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export default function JournalWrapper({ location, match, route }) {
  const settings = useSelectSettings();
  const { journal, journalResponse } = useSelectJournal();
  const isHomePage = location.pathname === match.url;

  return (
    <>
      {journal && (
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={journal} />
      )}
      <CheckFrontendMode
        debugLabel="ProjectWrapper"
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
          journalResponse,
          settings
          // dispatch,
          // fetchData
        }
      })}
    </>
  );
}

JournalWrapper.displayName = "Frontend.Containers.JournalWrapper";

JournalWrapper.propTypes = {
  route: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
};