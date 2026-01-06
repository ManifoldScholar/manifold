import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import Project from "frontend/components/project";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import IssueDetail from "frontend/containers/IssueDetail";
import { useSettings } from "hooks";
import { getJournalBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";

export default function ProjectDetailRoute() {
  const project = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;
  const headContentProps = useEntityHeadContent(project);

  if (project.attributes?.isJournalIssue) {
    return (
      <IssueDetail
        project={project}
        breadcrumbs={getJournalBreadcrumbs(project, t, libraryDisabled)}
      />
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
