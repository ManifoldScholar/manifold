import PropTypes from "prop-types";
import Project from "frontend/components/project";
import { useOutletContext } from "react-router-dom";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import IssueDetail from "frontend/containers/IssueDetail";

function ProjectDetailContainer() {
  const { project, journalBreadcrumbs } = useOutletContext() || {};
  const headContentProps = useEntityHeadContent(project);

  if (!project) return null;

  if (project.attributes?.isJournalIssue)
    return <IssueDetail project={project} breadcrumbs={journalBreadcrumbs} />;

  return (
    <>
      <CheckFrontendMode debugLabel="ProjectDetail" isProjectHomePage />
      <HeadContent {...headContentProps} />
      <Project.Detail project={project} />
      <Schema.Project project={project} />
    </>
  );
}

ProjectDetailContainer.displayName = "Frontend.Containers.ProjectDetail";

export default ProjectDetailContainer;
