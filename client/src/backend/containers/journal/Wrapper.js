import React, { useCallback } from "react";
import Layout from "backend/components/layout";
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
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";

function JournalWrapper({ match, route, history, confirm, location }) {
  const { t } = useTranslation();
  const { data: journal, refresh } = useFetch({
    request: [journalsAPI.show, match.params.id]
  });
  const destroy = useApiCallback(journalsAPI.destroy, { removes: journal });

  const notifyDestroy = useNotification(j => ({
    level: 0,
    id: `JOURNAL_DESTROYED_${j.id}`,
    heading: t("notifications.journal_delete"),
    body: t("notifications.delete_entity_body", {
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
    const heading = t("modals.delete_journal");
    const message = t("modals.confirm_body");
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
            className="utility-button__icon"
          />
          <span className="utility-button__text">{t("actions.view")}</span>
        </Link>
        <Authorize entity={journal} ability={"delete"}>
          <button onClick={handleJournalDestroy} className="utility-button">
            <IconComposer
              icon="delete32"
              size={26}
              className="utility-button__icon"
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

  const subpage = location.pathname.split("/")[4]?.replace("-", "_");

  const issues = journal.relationships.journalIssues?.map(i => ({
    title: i.attributes.title,
    ...i.relationships.project
  }));

  return (
    <div>
      <Authorize
        entity={journal}
        failureFatalError={{
          detail: t("journals.unauthorized_edit")
        }}
        ability={["read"]}
      >
        {subpage && (
          <HeadContent
            title={`${t(`titles.${subpage}`)} | ${
              journal.attributes.titlePlaintext
            } | ${t("common.admin")}`}
            appendDefaultTitle
          />
        )}
        <RedirectToFirstMatch
          from={lh.link("backendJournal", journal.id)}
          candidates={navigation.journal(journal)}
        />
        <PageHeader
          type="journal"
          title={journal.attributes.titleFormatted}
          subtitle={journal.attributes.subtitle}
          utility={renderUtility(journal)}
          secondaryLinks={navigation.journal(journal)}
          issues={issues}
        />
        <Layout.BackendPanel
          sidebar={
            <Layout.SecondaryNav
              links={navigation.journal(journal)}
              panel
              ariaLabel={t("journals.settings")}
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
