import React from "react";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import GlobalUtility from "global/components/utility";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import lh from "helpers/linkHandler";
import { useSelectAllJournals, useDispatchAllJournals } from "hooks/journals";
import { usePaginationState } from "hooks/pagination";
import { pageChangeHandlerCreator } from "helpers/pageChangeHandlerCreator";

export default function JournalsListContainer({ location }) {
  const { journals, journalsMeta } = useSelectAllJournals();
  const { paginationState, handlePageChange } = usePaginationState(location);

  useDispatchAllJournals(paginationState.number, "frontend");

  const hasJournals = !!journals?.length;
  const showPagination = journalsMeta?.pagination?.totalPages > 1;

  return journals ? (
    <>
      <CheckFrontendMode debugLabel="JournalsList" />
      <RegisterBreadcrumbs
        breadcrumbs={[
          { to: lh.link("frontendIssuesList"), label: "Back to issues list" }
        ]}
      />
      <h1 className="screen-reader-text">Journals</h1>
      {hasJournals &&
        journals.map((journal, index) => (
          <EntityCollection.JournalIssues
            key={journal.id}
            journal={journal}
            limit={4}
            bgColor={index % 2 === 1 ? "neutral05" : "white"}
          />
        ))}
      {!hasJournals && <EntityCollectionPlaceholder.Journals />}
      {showPagination && (
        <section>
          <div className="container">
            <GlobalUtility.Pagination
              paginationClickHandler={pageChangeHandlerCreator(
                handlePageChange
              )}
              pagination={journalsMeta.pagination}
            />
          </div>
        </section>
      )}
    </>
  ) : null;
}
