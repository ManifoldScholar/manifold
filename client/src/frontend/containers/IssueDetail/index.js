import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import Issue from "frontend/components/issue";

export default function IssueDetailContainer({ project }) {
  if (!project) return null;

  const issue = project.relationships?.journalIssue;
  const parentJournal = project.relationships?.journal;
  const parentVolume = issue.relationships?.journalVolume;

  return (
    <>
      <CheckFrontendMode debugLabel="IssueDetail" isProjectHomePage />
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
            to: lh.link("frontendProjectDetail", project.slug),
            label: `Issue ${issue.attributes.number}`
          }
        ].filter(Boolean)}
      />
      <EntityHeadContent entity={project} parentEntity={parentJournal} />
      <Issue.Detail issue={project} />
    </>
  );
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object,
  issueResponse: PropTypes.object
};
