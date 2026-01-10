import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import Project from "frontend/components/project";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import Issue from "frontend/components/issue";
import { useSettings } from "hooks";
import { getJournalBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";

export default function ProjectDetailRoute() {
  const project = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;
  const headContentProps = useEntityHeadContent(project);

  const parentJournal = project?.relationships?.journal;
  const issueHeadContentProps = useEntityHeadContent(project, parentJournal);

  if (project.attributes?.isJournalIssue) {
    const breadcrumbs = getJournalBreadcrumbs(project, t, libraryDisabled);

    return (
      <>
        <CheckFrontendMode debugLabel="IssueDetail" isProjectHomePage />
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
        <HeadContent {...issueHeadContentProps} />
        <Issue.Detail issue={project} />
        <Schema.Issue issue={project} />
      </>
    );
  }

  return (
    <>
      <CheckFrontendMode debugLabel="ProjectDetail" isProjectHomePage />
      <HeadContent {...headContentProps} />
      <Project.Detail project={project} />
      <Schema.Project project={project} />
    </>
  );
}
