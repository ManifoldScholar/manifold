import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetch, usePaginationState, useSetLocation } from "hooks";
import { journalIssuesAPI } from "api";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import lh from "helpers/linkHandler";
import { capitalize } from "utils/string";

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

  const { t } = useTranslation();

  const { titlePlaintext } = journal?.attributes || {};
  const breadcrumbs = useMemo(
    () => [
      {
        to: lh.link("frontendJournalsList"),
        label: t("navigation.breadcrumbs.all_journals")
      },
      {
        to: lh.link("frontendJournalDetail", journal.id),
        label: titlePlaintext
      },
      {
        to: lh.link("frontendJournalAllIssues", journal.id),
        label: t("navigation.breadcrumbs.issues")
      }
    ],
    [journal.id, t, titlePlaintext]
  );

  if (!journal || !issues || !meta) return null;

  return (
    <>
      <h1 className="screen-reader-text">
        {`${titlePlaintext}: ${capitalize(t("glossary.issue_other"))}`}
      </h1>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityHeadContent entity={journal} />
      <EntityMasthead entity={journal} />
      <EntityCollection.Issues
        title={`${titlePlaintext}: ${capitalize(t("glossary.issue_other"))}`}
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
