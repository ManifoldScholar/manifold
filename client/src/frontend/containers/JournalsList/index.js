import React from "react";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import GlobalUtility from "global/components/utility";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import lh from "helpers/linkHandler";
import { useSelectAllJournals, useDispatchAllJournals } from "hooks/journals";
import { usePaginationState } from "hooks/pagination";
import { pageChangeHandlerCreator } from "helpers/pageChangeHandlerCreator";

export default function JournalsListContainer({ location }) {
  const { journals, journalsMeta } = useSelectAllJournals();
  const { paginationState, handlePageChange } = usePaginationState(location);

  useDispatchAllJournals(paginationState.number, "frontend");

  const showPagination = journalsMeta?.pagination?.totalPages > 1;

  return journals ? (
    <>
      <CheckFrontendMode debugLabel="JournalsList" isProjectSubpage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          { to: lh.link("frontendIssuesList"), label: "Back to issues list" }
        ]}
      />
      <h1 className="screen-reader-text">Journals List</h1>
      <h2>Journals List Container</h2>
      <p>{JSON.stringify(journals)}</p>
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
  // Show placeholder like project collections?
  // if (this.showPlaceholder) return <ProjectCollection.Placeholder />;
}
