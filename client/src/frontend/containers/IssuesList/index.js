import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import {
  useSelectAllIssues,
  useDispatchAllIssues,
  usePaginationState,
  useFilterState,
  useSetUrlParamsFromState
} from "hooks";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { pageChangeHandlerCreator } from "helpers/pageChangeHandlerCreator";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const INIT_FILTER_STATE = {
  standaloneModeEnforced: false
};

function getSearch(location) {
  return queryString.parse(location.search);
}

function getInitialPageNumber(location) {
  const { page } = getSearch(location);
  return page || DEFAULT_PAGE;
}

export default function IssuesListContainer({ location }) {
  const { issues, issuesMeta } = useSelectAllIssues();
  const [filters, setFilters] = useFilterState(location, INIT_FILTER_STATE);
  const initialNumber = getInitialPageNumber(location);
  const [pagination, setPageNumber] = usePaginationState(
    initialNumber,
    DEFAULT_PER_PAGE
  );

  useDispatchAllIssues(filters, pagination.number, "frontend");
  useSetUrlParamsFromState(location, filters, pagination.number);

  // Update when we have the api
  // const hasVisibleIssues = settings?.attributes?.calculated?.hasVisibleIssues

  return issues ? (
    <>
      <h1 className="screen-reader-text">All Journal Issues</h1>
      <EntityCollection.Issues
        issues={issues}
        issuesMeta={issuesMeta}
        filterProps={{
          filterChangeHandler: filterParam =>
            setFilters({ param: filterParam }),
          initialFilterState: filters,
          resetFilterState: INIT_FILTER_STATE
        }}
        paginationProps={{
          paginationClickHandler: pageChangeHandlerCreator(setPageNumber)
        }}
        bgColor="neutral05"
      />
      {/* Replace true with hasVisibleIssues once we have the setting */}
      {/* {true && (
        <CollectionNavigation entityType="journals" />
      )} */}
    </>
  ) : null;
  // Will there be a placeholder component like for projects?
  // if (this.showPlaceholder()) return <ProjectList.Placeholder />;
}

IssuesListContainer.propTypes = {
  location: PropTypes.object.isRequired
};
