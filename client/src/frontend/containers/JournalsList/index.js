import React from "react";
import { journalsAPI } from "api";
import GlobalUtility from "global/components/utility";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { useFetch, useFilterState, usePaginationState } from "hooks";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";

export default function JournalsListContainer() {
  const [filters] = useFilterState();
  const [pagination, setPageNumber] = usePaginationState();
  const { data: journals, meta } = useFetch({
    request: [journalsAPI.index, filters, pagination]
  });

  if (!journals || !meta) return null;

  const showPagination = meta.pagination?.totalPages > 1;

  return (
    <>
      <CheckFrontendMode debugLabel="JournalsList" />
      <h1 className="screen-reader-text">Journals</h1>
      {!!journals.length &&
        journals.map((journal, index) => (
          <EntityCollection.JournalSummary
            key={journal.id}
            journal={journal}
            bgColor={index % 2 === 1 ? "neutral05" : "white"}
            limit={8}
          />
        ))}
      {!journals.length && <EntityCollectionPlaceholder.Journals />}
      {showPagination && (
        <section>
          <div className="container">
            <GlobalUtility.Pagination
              paginationClickHandler={page => () => setPageNumber(page)}
              pagination={meta.pagination}
            />
          </div>
        </section>
      )}
      <CollectionNavigation />
    </>
  );
}
