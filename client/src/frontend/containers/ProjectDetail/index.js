import React from "react";
import PropTypes from "prop-types";
import Project from "frontend/components/project";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";

function ProjectDetailContainer({ project, response }) {
  if (
    project?.attributes?.isJournalIssue &&
    project?.relationships?.journalIssue?.id
  )
    return (
      <Redirect
        to={lh.link(
          "frontendIssueDetail",
          project?.relationships?.journalIssue?.id
        )}
      />
    );

  if (response?.status === 401) return <Redirect to={lh.link("frontend")} />;

  return project ? (
    <>
      <CheckFrontendMode debugLabel="ProjectDetail" isProjectHomePage />
      <EntityHeadContent entity={project} />
      <Project.Detail project={project} />
      <Schema.Project project={project} />
    </>
  ) : null;
}

ProjectDetailContainer.displayName = "Frontend.Containers.ProjectDetail";

ProjectDetailContainer.propTypes = {
  project: PropTypes.object,
  response: PropTypes.object
};

export default ProjectDetailContainer;
