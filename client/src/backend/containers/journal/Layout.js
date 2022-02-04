import React from "react";
import PropTypes from "prop-types";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import { journalsAPI } from "api";
import { childRoutes } from "helpers/router";
import Hero from "backend/components/hero";
import { useFetch } from "hooks";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

function JournalLayoutContainer({ journal, refresh, history, route }) {
  const { data: actionCallouts, refresh: refreshActionCallouts } = useFetch({
    request: [journalsAPI.actionCallouts, journal.id]
  });

  const dispatch = useDispatch();

  if (!__SERVER__) window.refresh = refreshActionCallouts;

  const drawerProps = {
    closeUrl: lh.link("backendJournalLayout", journal?.id),
    lockScroll: "always"
  };

  if (!journal) return null;

  return (
    <Authorize
      entity={journal}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendJournal", journal.id)}
    >
      <Hero.Builder
        include={["journalDescription", "actionCallouts", "social"]}
        dispatch={dispatch}
        history={history}
        actionCallouts={actionCallouts}
        refreshActionCallouts={refreshActionCallouts}
        refresh={refresh}
        model={journal}
        modelLabel="journal"
        actionCalloutSlots={["right-button", "right-link"]}
        failureRedirectRout="backendJournal"
        actionCalloutEditRoute="backendJournalActionCalloutEdit"
        actionCalloutNewRoute="backendJournalActionCalloutNew"
        api={journalsAPI}
        withDarkMode={false}
      />
      {childRoutes(route, {
        childProps: {
          calloutable: journal,
          refreshActionCallouts,
          closeRoute: "backendJournalLayout"
        },
        drawer: true,
        drawerProps: { wide: true, ...drawerProps }
      })}
    </Authorize>
  );
}

JournalLayoutContainer.propTypes = {
  journal: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  route: PropTypes.object,
  refresh: PropTypes.func
};

export default withRouter(JournalLayoutContainer);
