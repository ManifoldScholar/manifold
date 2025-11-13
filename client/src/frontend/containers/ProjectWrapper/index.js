import { useCallback } from "react";
import { useParams, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, useFromStore } from "hooks";
import { projectsAPI } from "api";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { getJournalBreadcrumbs } from "./helpers";

export default function ProjectWrapper() {
  const { id } = useParams();
  const { data: project } = useFetch({
    request: [projectsAPI.show, id]
  });
  const location = useLocation();
  const isHomePage = location.pathname === `/projects/${id}`;
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { t } = useTranslation();

  const breadcrumbsCallback = useCallback(
    () => getJournalBreadcrumbs(project, t, libraryDisabled),
    [project, t, libraryDisabled]
  );

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? breadcrumbsCallback()
    : null;

  return (
    <>
      {project && (
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
      )}
      <CheckFrontendMode
        debugLabel="ProjectWrapper"
        project={project}
        isProjectHomePage={isHomePage}
      />
      <Outlet
        context={{
          project,
          settings,
          journalBreadcrumbs
        }}
      />
    </>
  );
}

ProjectWrapper.displayName = "Frontend.Containers.ProjectWrapper";
