import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useLocation, useNavigate, Outlet } from "react-router-dom";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
import PageHeader from "backend/components/layout/PageHeader";
import { useFetch, useApiCallback, useNotification } from "hooks";

function ProjectWrapperContainer({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: project, response: projectResponse, refresh } = useFetch({
    request: [projectsAPI.show, id],
    options: { requestKey: requests.beProject, force: true }
  });

  const destroy = useApiCallback(projectsAPI.destroy, {
    requestKey: requests.beProjectDestroy,
    removes: project
  });

  const notifyDestroy = useNotification(p => ({
    level: 0,
    id: `PROJECT_DESTROYED_${p.id}`,
    heading: t("notifications.project_delete"),
    body: t("notifications.delete_entity_body", {
      title: p?.attributes?.titlePlaintext
    }),
    expiration: 5000
  }));

  const destroyAndRedirect = useCallback(async () => {
    if (!project) return;
    try {
      await destroy(project.id);
      notifyDestroy(project);
      navigate(lh.link("backend"));
    } catch {
      navigate(lh.link("backend"));
    }
  }, [destroy, project, notifyDestroy, navigate]);

  const handleProjectDestroy = useCallback(() => {
    const heading = t("modals.delete_project");
    const message = t("modals.confirm_body");
    confirm(heading, message, destroyAndRedirect);
  }, [confirm, destroyAndRedirect, t]);

  if (!project) return null;

  const utility = [
    {
      label: "actions.view",
      route: "frontendProjectDetail",
      slug: project.attributes.slug,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleProjectDestroy
    }
  ];

  const updateProject = projectsAPI.update;

  const secondaryLinks = navigation.project(project);
  const isJournalIssue = project.attributes.isJournalIssue;

  const breadcrumbs = getBreadcrumbs(
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
    <Authorize
      entity={project}
      failureNotification={{
        body: t("projects.unauthorized_edit")
      }}
      failureRedirect
      ability={["update", "manageResources"]}
    >
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
        secondaryLinks={secondaryLinks}
        {...parentProps}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={secondaryLinks}
            panel
            ariaLabel={t("projects.settings")}
          />
        }
      >
        <div>
          <Outlet
            context={{ refresh, updateProject, project, projectResponse }}
          />
        </div>
      </Layout.BackendPanel>
    </Authorize>
  );
}

ProjectWrapperContainer.displayName = "Project.Wrapper";

export default withConfirmation(ProjectWrapperContainer);
