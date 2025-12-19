import { redirect, Outlet } from "react-router";
import { projectsAPI } from "api";
import { projectContext } from "app/contexts";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { useSettings } from "hooks";
import { useTranslation } from "react-i18next";

export const loader = async ({ params, context }) => {
  if (params.id === "all") {
    throw redirect("/projects");
  }

  const fetchFn = () => projectsAPI.show(params.id);
  const project = await loadEntity({ context, fetchFn });

  context.set(projectContext, project);

  return project;
};

const getJournalBreadcrumbs = (project, t, libraryDisabled) => {
  const issue = project.relationships?.journalIssue;
  const parentJournal = project.relationships?.journal;
  const parentVolume = issue?.relationships?.journalVolume;

  return [
    !libraryDisabled && {
      to: "/journals",
      label: t("navigation.breadcrumbs.all_journals")
    },
    parentJournal && {
      to: `/journals/${parentJournal.attributes.slug}`,
      label: parentJournal.attributes.titlePlaintext
    },
    parentVolume && {
      to: `/journals/${parentJournal.attributes.slug}/volumes/${parentVolume.attributes.slug}`,
      label: `${t("glossary.volume_one")} ${parentVolume.attributes.number}`
    },
    {
      to: `/projects/${project.attributes.slug}`,
      label: `${t("glossary.issue_truncated_one")} ${issue.attributes.number}`
    }
  ].filter(Boolean);
};

export default function ProjectWrapperRoute({ loaderData: project }) {
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
      <Outlet
        context={{
          project,
          journalBreadcrumbs
        }}
      />
    </>
  );
}
