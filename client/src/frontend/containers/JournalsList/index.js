import React from "react";
import queryString from "query-string";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import GlobalUtility from "global/components/utility";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import lh from "helpers/linkHandler";
import {
  useSelectAllJournals,
  useDispatchAllJournals,
  usePaginationState
} from "hooks";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

function getSearch(location) {
  return queryString.parse(location.search);
}

function setInitialPaginationState(location) {
  const { page } = getSearch(location);
  return {
    number: page || DEFAULT_PAGE,
    size: DEFAULT_PER_PAGE
  };
}

export default function JournalsListContainer({ location }) {
  const { journals, journalsMeta } = useSelectAllJournals();
  const [pagination, setPageNumber] = usePaginationState(
    setInitialPaginationState(location)
  );

  useDispatchAllJournals(pagination.number, "frontend");

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
              paginationClickHandler={setPageNumber}
              pagination={journalsMeta.pagination}
            />
          </div>
        </section>
      )}
    </>
  ) : null;
}
