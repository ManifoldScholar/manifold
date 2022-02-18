import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useListFilters
  // useFromStore
} from "hooks";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";

import { journalIssuesAPI } from "api";

export default function IssuesListContainer() {
  // Add back in when api supports filters
  // const subjects = useFromStore("feSubjects", "select");

  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = { standaloneModeEnforced: false };
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: issues, meta } = useFetch({
    request: [journalIssuesAPI.index, filters, pagination]
  });

  useSetLocation({ filters, page: pagination.number });
  const location = useLocation();

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    init: filters,
    reset: baseFilters
  });

  if (!issues || !meta) return null;

  const showPlaceholder = location.search ? false : !issues.length;

  return (
    <>
      <h1 className="screen-reader-text">All Journal Issues</h1>
      {!showPlaceholder && (
        <EntityCollection.Issues
          title="All Journal Issues"
          issues={issues}
          issuesMeta={meta}
          filterProps={filterProps}
          paginationProps={{
            paginationClickHandler: page => () => setPageNumber(page),
            paginationTarget: "#"
          }}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      {showPlaceholder && <EntityCollectionPlaceholder.Issues />}
      <CollectionNavigation />
    </>
  );
}
