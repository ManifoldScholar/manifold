import { Outlet, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { journalsAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import Dialog from "global/components/dialog";
import navigation from "helpers/router/navigation";
import { useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const loader = async ({ params, context, request }) => {
  const journal = await loadEntity({
    context,
    fetchFn: () => journalsAPI.show(params.id),
    request
  });
  await authorize({ request, context, entity: journal, ability: "update" });
  return journal;
};

export default function JournalDetailLayout({ loaderData: journal }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const destroy = useApiCallback(journalsAPI.destroy);

  const handleDelete = () => {
    confirm({
      heading: t("modals.delete_journal"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(journal.id);
          addNotification({
            level: 0,
            id: `JOURNAL_DESTROYED_${journal.id}`,
            heading: t("notifications.journal_delete"),
            body: t("notifications.delete_entity_body", {
              title: journal?.attributes?.titlePlaintext
            }),
            expiration: 5000
          });
          navigate("/backend/journals");
        } catch {
          closeDialog();
          addNotification({
            level: 2,
            id: `JOURNAL_DESTROY_FAILED_${journal.id}`,
            heading: t("notifications.delete_failure", {
              entity: journal?.attributes?.titlePlaintext
            }),
            body: t("notifications.delete_failure_body"),
            expiration: 5000
          });
        }
      }
    });
  };

  const utility = [
    {
      label: "actions.view",
      path: `/journals/${journal.attributes.slug}`,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleDelete
    }
  ];

  const subpage = location.pathname.split("/")[4]?.replace("-", "_");

  const breadcrumbs = [
    {
      to: "/backend/journals",
      label: t("glossary.journal_title_case_other")
    },
    {
      to: `/backend/journals/${journal.id}`,
      label: journal.attributes.titlePlaintext
    }
  ];

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {subpage && (
        <HeadContent
          title={`${t(`titles.${subpage}`)} | ${
            journal.attributes.titlePlaintext
          } | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
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
        <div>
          <Outlet context={journal} />
        </div>
      </Layout.BackendPanel>
    </>
  );
}
