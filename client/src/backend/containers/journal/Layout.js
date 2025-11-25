import { useOutletContext } from "react-router-dom";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import { journalsAPI } from "api";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import Hero from "backend/components/hero";
import { useFetch } from "hooks";
import { useDispatch } from "react-redux";

export default function JournalLayoutContainer() {
  const { journal, refresh } = useOutletContext() || {};

  const { data: actionCallouts, refresh: refreshActionCallouts } = useFetch({
    request: [journalsAPI.actionCallouts, journal?.id],
    condition: !!journal?.id
  });

  const dispatch = useDispatch();

  if (!__SERVER__) window.refresh = refreshActionCallouts;

  const drawerProps = {
    closeUrl: lh.link("backendJournalLayout", journal?.id),
    lockScroll: "always",
    wide: true
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
        include={["journalDescription", "actionCallouts"]}
        dispatch={dispatch}
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
      <OutletWithDrawer
        drawerProps={drawerProps}
        context={{
          calloutable: journal,
          refreshActionCallouts,
          closeRoute: "backendJournalLayout"
        }}
      />
    </Authorize>
  );
}
