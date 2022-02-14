import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useFromStore
} from "hooks";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";

import { journalIssuesAPI } from "api";

export default function IssuesListContainer() {
  const subjects = useFromStore("feSubjects", "select");

  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = { standaloneModeEnforced: false };
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: issues, meta } = useFetch({
    request: [journalIssuesAPI.index, filters, pagination]
  });

  useSetLocation({ filters, page: pagination.number });
  const location = useLocation();

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
          filterProps={{
            filterChangeHandler: param => setFilters({ newState: param }),
            initialFilterState: filters,
            resetFilterState: baseFilters,
            subjects
          }}
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

IssuesListContainer.propTypes = {
  location: PropTypes.object.isRequired
};
