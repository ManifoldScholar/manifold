import { useLocation, useParams, Redirect, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, useFromStore } from "hooks";
import { projectsAPI } from "api";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { getJournalBreadcrumbs } from "./helpers";
import lh from "helpers/linkHandler";

export default function ProjectWrapper() {
  const { id } = useParams();
  const { data: project } = useFetch({
    request: [projectsAPI.show, id],
    condition: id !== "all"
  });
  const location = useLocation();
  const isHomePage = location.pathname === `/projects/${id}`;
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { t } = useTranslation();

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;

  if (id === "all") return <Redirect to={lh.link("frontendProjectsAll")} />;

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
