import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import Project from "components/frontend/project";
import Schema from "components/global/schema";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import HeadContent from "components/global/HeadContent";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import Issue from "components/frontend/issue";
import { useSettings } from "hooks";
import { getJournalBreadcrumbs } from "helpers/breadcrumbs";
import EventTracker, { EVENTS } from "components/global/EventTracker";

export const handle = { frontendMode: { isProjectHomepage: true } };

export default function ProjectDetailRoute() {
  const project = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();

  const headContentProps = useEntityHeadContent(project);
  const parentJournal = project?.relationships?.journal;
  const issueHeadContentProps = useEntityHeadContent(project, parentJournal);

  if (project.attributes?.isJournalIssue) {
    const libraryDisabled = settings?.attributes?.general?.libraryDisabled;
    const breadcrumbs = getJournalBreadcrumbs(project, t, libraryDisabled);

    return (
      <>
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
        <HeadContent {...issueHeadContentProps} />
        <Issue.Detail issue={project} />
        <Schema.Issue issue={project} />
      </>
    );
  }

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
      <HeadContent {...headContentProps} />
      <Project.Detail project={project} />
      <Schema.Project project={project} />
    </>
  );
}
