import React from "react";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import GlobalUtility from "global/components/utility";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import lh from "helpers/linkHandler";
import { usePaginationState, useSelectAllJournals } from "hooks";

export default function JournalsListContainer({ location }) {
  const { journals, journalsMeta } = useSelectAllJournals();
  const { paginationState, setPaginationState } = usePaginationState(location);

  function handlePageChange(pageParam) {
    setPaginationState(prevState => {
      return { ...prevState, number: pageParam };
    });
  }

  const pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      handlePageChange(pageParam);
    };
  };

  return (
    <>
      <CheckFrontendMode debugLabel="ProjectCollections" isProjectSubpage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          { to: lh.link("frontendIssuesList"), label: "Back to issues list" }
        ]}
      />
      <h1 className="screen-reader-text">Journals List</h1>
      <h2>Journals List Container</h2>
      {false && (
        <section>
          <div className="container">
            <GlobalUtility.Pagination
              paginationClickHandler={pageChangeHandlerCreator}
              pagination={journalsMeta.pagination}
            />
          </div>
        </section>
      )}
    </>
  );
}
