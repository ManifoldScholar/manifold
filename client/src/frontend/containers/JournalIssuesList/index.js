import React, { useMemo } from "react";
import { useFetch, usePaginationState, useSetLocation } from "hooks";
import { journalIssuesAPI } from "api";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import lh from "helpers/linkHandler";

export default function JournalIssuesList({ journal }) {
  const [pagination, setPageNumber] = usePaginationState();
  const issuesFilter = useMemo(
    () => ({ journal_id: journal.id, volume_is_nil: true }),
    [journal.id]
  );
  const { data: issues, meta } = useFetch({
    request: [journalIssuesAPI.index, issuesFilter, pagination]
  });

  useSetLocation({ page: pagination.number });

  if (!journal || !issues || !meta) return null;

  const { titlePlaintext } = journal.attributes;

  return (
    <>
      <h1 className="screen-reader-text">{`${titlePlaintext}: Issues`}</h1>
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendJournalsList"),
            label: "All Journals"
          },
          {
            to: lh.link("frontendJournalDetail", journal.id),
            label: titlePlaintext
          },
          {
            to: lh.link("frontendJournalAllIssues", journal.id),
            label: "Issues"
          }
        ]}
      />
      <EntityHeadContent entity={journal} />
      <EntityMasthead entity={journal} />
      <EntityCollection.Issues
        title={`${titlePlaintext}: Issues`}
        icon={null}
        issues={issues}
        issuesMeta={meta}
        paginationProps={{
          paginationClickHandler: page => () => setPageNumber(page),
          paginationTarget: "#"
        }}
        parentView
      />
    </>
  );
}
