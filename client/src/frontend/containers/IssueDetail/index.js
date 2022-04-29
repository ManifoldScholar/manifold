import React from "react";
import PropTypes from "prop-types";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/entity/HeadContent";
import Issue from "frontend/components/issue";
import Schema from "global/components/schema";

export default function IssueDetailContainer({ project, breadcrumbs }) {
  if (!project) return null;

  const parentJournal = project.relationships?.journal;

  return (
    <>
      <CheckFrontendMode debugLabel="IssueDetail" isProjectHomePage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityHeadContent
        entity={project}
        parentEntity={parentJournal}
        showParentTitle={false}
      />
      <Issue.Detail issue={project} />
      <Schema.Issue issue={project} />
    </>
  );
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object
};
