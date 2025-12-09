import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Outlet, useLoaderData } from "react-router";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
import PageHeader from "backend/components/layout/PageHeader";
import { useApiCallback, useNotification, useFromStore } from "hooks";

function ProjectWrapperContainer({ confirm }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const loaderData = useLoaderData();
  const requestKey = loaderData?.requestKey;

  const project = useFromStore({
    requestKey,
    action: "select"
  });
  const projectResponse = useFromStore({
    requestKey,
    action: "response"
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
    <>
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
            context={{ requestKey, updateProject, project, projectResponse }}
          />
        </div>
      </Layout.BackendPanel>
    </>
  );
}

ProjectWrapperContainer.displayName = "Project.Wrapper";

export default withConfirmation(ProjectWrapperContainer);
