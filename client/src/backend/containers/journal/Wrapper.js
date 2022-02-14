import React, { useCallback } from "react";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import withConfirmation from "hoc/withConfirmation";
import { journalsAPI } from "api";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";
import { useFetch, useApiCallback, useNotification } from "hooks";

function JournalWrapper({ match, route, history, confirm }) {
  const { data: journal, refresh } = useFetch({
    request: [journalsAPI.show, match.params.id]
  });
  const destroy = useApiCallback(journalsAPI.destroy, { removes: journal });

  const notifyDestroy = useNotification(j => ({
    level: 0,
    id: `JOURNAL_DESTROYED_${j.id}`,
    heading: "The journal has been destroyed.",
    body: `${j?.attributes?.title} has passed into the endless night.`,
    expiration: 5000
  }));

  const destroyAndRedirect = useCallback(() => {
    const redirect = () => history.push(lh.link("backendJournals"));
    destroy(journal.id).then(
      () => {
        notifyDestroy(journal);
        redirect();
      },
      () => redirect()
    );
  }, [destroy, history, journal, notifyDestroy]);

  const handleJournalDestroy = useCallback(() => {
    const heading = "Are you sure you want to delete this journal?";
    const message = "This action cannot be undone.";
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm]);

  const renderUtility = () => {
    return (
      <div className="utility-button-group utility-button-group--inline">
        <Link
          to={lh.link("frontendJournalDetail", journal.attributes.slug)}
          className="utility-button"
        >
          <IconComposer
            icon="eyeOpen32"
            size={26}
            className="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">View</span>
        </Link>
        <Authorize entity={journal} ability={"delete"}>
          <button onClick={handleJournalDestroy} className="utility-button">
            <IconComposer
              icon="delete32"
              size={26}
              className="utility-button__icon utility-button__icon--notice"
            />
            <span className="utility-button__text">Delete</span>
          </button>
        </Authorize>
      </div>
    );
  };

  const renderRoutes = () => {
    return childRoutes(route, {
      childProps: { refresh, journal }
    });
  };

  if (!journal) return null;

  return (
    <div>
      <Authorize
        entity={journal}
        failureFatalError={{
          detail: "You are not allowed to edit this journal."
        }}
        ability={["update"]}
      >
        <RedirectToFirstMatch
          from={lh.link("backendJournal", journal.id)}
          candidates={navigation.journal(journal)}
        />
        <Navigation.DetailHeader
          type="journal"
          title={journal.attributes.titleFormatted}
          subtitle={journal.attributes.subtitle}
          utility={renderUtility(journal)}
          secondaryLinks={navigation.journal(journal)}
        />
        <Layout.BackendPanel
          sidebar={
            <Navigation.Secondary
              links={navigation.journal(journal)}
              panel
              ariaLabel="Journal Settings"
            />
          }
        >
          <div>{renderRoutes()}</div>
        </Layout.BackendPanel>
      </Authorize>
    </div>
  );
}

export default withConfirmation(JournalWrapper);
