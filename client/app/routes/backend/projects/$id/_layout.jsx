import { Outlet, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import HeadContent from "components/global/HeadContent";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { getProjectBreadcrumbs } from "helpers/breadcrumbs";
import Dialog from "components/global/dialog";
import navigation from "helpers/navigation";
import { useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const loader = async ({ params, context, request }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: project,
    ability: [
      "update",
      "manageResources",
      "manageResourceCollections",
      "manageTexts"
    ]
  });
  return project;
};

export default function ProjectDetailLayout({ loaderData: project }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const destroy = useApiCallback(projectsAPI.destroy);

  const handleDelete = () => {
    confirm({
      heading: t("modals.delete_project"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(project.id);
          addNotification({
            level: 0,
            id: `PROJECT_DESTROYED_${project.id}`,
            heading: t("notifications.project_delete"),
            body: t("notifications.delete_entity_body", {
              title: project?.attributes?.titlePlaintext
            }),
            expiration: 5000
          });
          navigate("/backend/projects/all");
        } catch {
          closeDialog();
          addNotification({
            level: 2,
            id: `PROJECT_DESTROY_FAILED_${project.id}`,
            heading: t("notifications.delete_failure", {
              entity: project?.attributes?.titlePlaintext
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
      path: `/projects/${project.attributes.slug}`,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleDelete
    }
  ];

  const isJournalIssue = project.attributes.isJournalIssue;
  const breadcrumbs = getProjectBreadcrumbs(
    project,
    location.state,
    isJournalIssue,
    t
  );
  const subpage = location.pathname.split("/")[4]?.replace("-", "_");

  const parentProps = isJournalIssue
    ? {
        parentTitle: project.relationships.journal.attributes.titleFormatted,
        parentSubtitle: project.relationships.journal.attributes.subtitle,
        parentId: project.relationships.journal.id,
        issues: project.attributes.journalIssuesNav
      }
    : {};

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {subpage && (
        <HeadContent
          title={`${t(`titles.${subpage}`)} | ${
            project.attributes.titlePlaintext
          } | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type={isJournalIssue ? "issue" : "project"}
        title={project.attributes.titleFormatted}
        subtitle={project.attributes.subtitle}
        texts={project.attributes.textsNav}
        actions={utility}
        secondaryLinks={navigation.project(project)}
        {...parentProps}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={navigation.project(project)}
            panel
            ariaLabel={t("projects.settings")}
          />
        }
      >
        <div>
          <Outlet context={project} />
        </div>
      </Layout.BackendPanel>
    </>
  );
}
