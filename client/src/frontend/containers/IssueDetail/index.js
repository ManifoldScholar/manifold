import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import Issue from "frontend/components/issue";
import { fixtures } from "helpers/storybook/exports";

export default function IssueDetailContainer({ issue, issueResponse }) {
  if (!issueResponse) return null;

  if (issueResponse.status === 401)
    return <Redirect to={lh.link("frontend")} />;

  if (!issue) return null;

  // TODO: update once API is in place
  const parentJournal =
    issue.relationships?.journal || fixtures.factory("journal");

  return (
    <>
      <CheckFrontendMode debugLabel="ProjectDetail" isProjectHomePage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendIssuesList"),
            label: "Back to All Issues"
          },
          // TODO: can remove condition once API is in place?
          !!parentJournal && {
            to: lh.link("frontendJournalDetail", parentJournal.id),
            label: parentJournal.attributes.titlePlaintext
          },
          {
            to: lh.link("frontendIssueDetail", issue.id),
            label: issue.attributes.titlePlaintext
          }
        ].filter(Boolean)}
      />
      <EntityHeadContent entity={issue} parentEntity={parentJournal} />
      <Issue.Detail issue={issue} />
    </>
  );
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object,
  issueResponse: PropTypes.object
};
