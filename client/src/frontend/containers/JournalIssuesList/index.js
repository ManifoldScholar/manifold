import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useFetch,
  usePaginationState,
  useSetLocation,
  useFromStore
} from "hooks";
import { journalIssuesAPI } from "api";
import EntityHeadContent from "frontend/components/entity/HeadContent";
import EntityMasthead from "frontend/components/entity/Masthead";
import EntityCollection from "frontend/components/entity/Collection";
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

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
  };

  const { t } = useTranslation();
  const settings = useFromStore("settings", "select");
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug } = journal?.attributes || {};
  const containerTitle = `${titlePlaintext}: ${t(
    "glossary.issue_truncated_title_case_other"
  )}`;

  const breadcrumbs = useMemo(() => {
    const nestedCrumbs = [
      {
        to: lh.link("frontendJournalDetail", slug),
        label: titlePlaintext
      },
      {
        to: lh.link("frontendJournalAllIssues", slug),
        label: t("navigation.breadcrumbs.issues")
      }
    ];
    return libraryDisabled
      ? nestedCrumbs
      : [
          {
            to: lh.link("frontendJournalsList"),
            label: t("navigation.breadcrumbs.all_journals")
          },
          ...nestedCrumbs
        ];
  }, [slug, t, titlePlaintext, libraryDisabled]);

  if (!journal || !issues || !meta) return null;

  return (
    <>
      <h1 className="screen-reader-text">{containerTitle}</h1>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityHeadContent entity={journal} />
      <EntityMasthead entity={journal} />
      <EntityCollection.Issues
        title={containerTitle}
        icon={null}
        issues={issues}
        issuesMeta={meta}
        paginationProps={{
          paginationClickHandler: paginationClickHandlerCreator
        }}
        parentView
      />
    </>
  );
}
