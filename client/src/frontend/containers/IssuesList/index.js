import React from "react";
import PropTypes from "prop-types";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useFromStore
} from "hooks";
import EntityCollection from "frontend/components/composed/EntityCollection";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";

import { journalIssuesAPI } from "api";

export default function IssuesListContainer() {
  const settings = useFromStore("settings", "select");
  const subjects = useFromStore("feSubjects", "select");

  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = { standaloneModeEnforced: false };
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: issues, meta } = useFetch({
    request: [journalIssuesAPI.index, filters, pagination]
  });

  useSetLocation(filters, pagination.number);

  // TODO: Update with setting for journals?
  const showNav = settings?.attributes?.calculated.hasVisibleProjects;

  // TODO: Add placeholder if there are no issues

  return issues ? (
    <>
      <h1 className="screen-reader-text">All Journal Issues</h1>
      <EntityCollection.Issues
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
          paginationTarget: ""
        }}
        bgColor="neutral05"
      />
      {showNav && <CollectionNavigation entityType="journals" />}
    </>
  ) : null;
}

IssuesListContainer.propTypes = {
  location: PropTypes.object.isRequired
};
