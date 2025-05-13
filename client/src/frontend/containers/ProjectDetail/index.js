import React from "react";
import PropTypes from "prop-types";
import Project from "frontend/components/project";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import IssueDetail from "frontend/containers/IssueDetail";

function ProjectDetailContainer({ project, response, journalBreadcrumbs }) {
  const headContentProps = useEntityHeadContent(project);

  if (response?.status === 401) return <Redirect to={lh.link("frontend")} />;

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

ProjectDetailContainer.propTypes = {
  project: PropTypes.object,
  response: PropTypes.object,
  journalBreadcrumbs: PropTypes.array,
};

export default ProjectDetailContainer;
