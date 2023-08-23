import React, { useCallback } from "react";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { journalsAPI } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import {
  useFetch,
  useApiCallback,
  useNotification,
  useRedirectToFirstMatch
} from "hooks";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";

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

  const utility = [
    {
      label: "actions.view",
      route: "frontendJournalDetail",
      slug: journal?.attributes.slug,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleJournalDestroy
    }
  ];

  const renderRoutes = () => {
    return childRoutes(route, {
      childProps: { refresh, journal }
    });
  };

  useRedirectToFirstMatch({
    route: "backendJournal",
    id: journal?.id,
    slug: journal?.attributes.slug,
    candidates: journal ? navigation.journal(journal) : []
  });

  if (!journal) return null;

  const subpage = location.pathname.split("/")[4]?.replace("-", "_");

  const breadcrumbs = [
    {
      to: lh.link("backendJournals"),
      label: t("glossary.journal_title_case_other")
    },
    {
      to: lh.link("backendJournals", journal.id),
      label: journal.attributes.titlePlaintext
    }
  ];

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
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
        <PageHeader
          type="journal"
          title={journal.attributes.titleFormatted}
          subtitle={journal.attributes.subtitle}
          actions={utility}
          secondaryLinks={navigation.journal(journal)}
          issues={journal.attributes.issuesNav}
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
