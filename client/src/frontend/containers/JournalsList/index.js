import React from "react";
import { journalsAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import GlobalUtility from "global/components/utility";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import lh from "helpers/linkHandler";
import { useFetch, useFilterState, usePaginationState } from "hooks";

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
      <RegisterBreadcrumbs
        breadcrumbs={[
          { to: lh.link("frontendIssuesList"), label: "Back to issues list" }
        ]}
      />
      <h1 className="screen-reader-text">Journals</h1>
      {journals.length &&
        journals.map((journal, index) => (
          <EntityCollection.JournalIssues
            key={journal.id}
            journal={journal}
            limit={4}
            bgColor={index % 2 === 1 ? "neutral05" : "white"}
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
    </>
  );
}
