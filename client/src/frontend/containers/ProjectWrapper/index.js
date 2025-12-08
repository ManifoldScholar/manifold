import { Outlet, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useFromStore } from "hooks";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { getJournalBreadcrumbs } from "./helpers";

export default function ProjectWrapper() {
  const { id } = useParams();
  const project = useFromStore({
    entityType: "projects",
    id,
    action: "grab"
  });
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { t } = useTranslation();

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;

  return (
    <>
      {project && (
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
      )}
      <Outlet
        context={{
          project,
          journalBreadcrumbs
        }}
      />
    </>
  );
}

ProjectWrapper.displayName = "Frontend.Containers.ProjectWrapper";
