import React from "react";
import PropTypes from "prop-types";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import Issue from "frontend/components/issue";

export default function IssueDetailContainer({ project, breadcrumbs }) {
  if (!project) return null;

  const parentJournal = project.relationships?.journal;

  return (
    <>
      <CheckFrontendMode debugLabel="IssueDetail" isProjectHomePage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityHeadContent entity={project} parentEntity={parentJournal} />
      <Issue.Detail issue={project} />
    </>
  );
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object
};
