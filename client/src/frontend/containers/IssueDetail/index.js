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

  const parentJournal = issue.relationships?.journal;
  const parentVolume = issue.relationships?.journalVolume;

  return (
    <>
      <CheckFrontendMode debugLabel="ProjectDetail" isProjectHomePage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendJournals"),
            label: "All Journals"
          },
          parentJournal && {
            to: lh.link("frontendJournalDetail", parentJournal.id),
            label: parentJournal.attributes.titlePlaintext
          },
          parentVolume && {
            to: lh.link(
              "frontendVolumeDetail",
              parentJournal.id,
              parentVolume.id
            ),
            label: `Volume ${parentVolume.attributes.number}`
          },
          {
            to: lh.link("frontendIssueDetail", issue.id),
            label: `Issue ${issue.attributes.number}`
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
