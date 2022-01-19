import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { useSelectJournal, useDispatchJournal } from "hooks/journals";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export default function JournalWrapper({ location, match, route }) {
  const { journal, journalResponse } = useSelectJournal(match);
  const isHomePage = location.pathname === match.url;
  useDispatchJournal(match);

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
          journalResponse
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
