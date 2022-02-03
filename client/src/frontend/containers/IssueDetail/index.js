import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import Issue from "frontend/components/issue";

export default function IssueDetailContainer({ issue, response }) {
  if (response?.status === 401) return <Redirect to={lh.link("frontend")} />;
  if (!issue) return null;

  const parentJournal = issue.relationships?.journal || null;
  const parentVolume = issue.relationships?.journalVolume || null;

  return (
    <>
      <CheckFrontendMode debugLabel="ProjectDetail" isProjectHomePage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendIssuesList"),
            label: "Back to All Issues"
          },
          // TODO: Update when api is ready
          parentJournal && {
            to: lh.link("frontendJournalDetail", parentJournal.id),
            label: "Journal Name Here"
          },
          parentVolume && {
            to: lh.link("frontendVolumeDetail", parentVolume.id),
            label: "Volume Number Here"
          },
          {
            to: lh.link("frontendIssueDetail", issue.id),
            label: issue.attributes.number
          }
        ].filter(Boolean)}
      />
      <EntityHeadContent
        entity={issue.relationships.project}
        parentEntity={parentJournal}
      />
      <Issue.Detail issue={issue.relationships.project} />
    </>
  );
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object,
  issueResponse: PropTypes.object
};
