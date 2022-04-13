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
import { useTranslation } from "react-i18next";

function JournalWrapper({ match, route, history, confirm }) {
  const { t } = useTranslation();
  const { data: journal, refresh } = useFetch({
    request: [journalsAPI.show, match.params.id]
  });
  const destroy = useApiCallback(journalsAPI.destroy, { removes: journal });

  const notifyDestroy = useNotification(j => ({
    level: 0,
    id: `JOURNAL_DESTROYED_${j.id}`,
    heading: t("backend_entities.journals.modals.delete_heading"),
    body: t("backend_entities.journals.modals.delete_body", {
      title: j?.attributes?.title
    }),
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
    const heading = t("backend_entities.journals.modals.confirm_heading");
    const message = t("backend_entities.journals.modals.confirm_body");
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm, t]);

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
          <span className="utility-button__text">{t("actions.view")}</span>
        </Link>
        <Authorize entity={journal} ability={"delete"}>
          <button onClick={handleJournalDestroy} className="utility-button">
            <IconComposer
              icon="delete32"
              size={26}
              className="utility-button__icon utility-button__icon--notice"
            />
            <span className="utility-button__text">{t("actions.delete")}</span>
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
          detail: t("backend_entities.journals.unauthorized_edit")
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
              ariaLabel={t("backend_entities.journals.settings")}
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
