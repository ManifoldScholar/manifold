import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
// import get from "lodash/get";
import {
  useSelectAllIssues,
  useSelectSettings,
  usePaginationState,
  useFilterState
} from "hooks";
import EntityCollection from "frontend/components/composed/EntityCollection";
import Layout from "frontend/components/layout";
import queryString from "query-string";

const DEFAULT_PAGE = 1;
const PER_PAGE = 10;
const INIT_FILTER_STATE = {};

function getSearch(location) {
  return queryString.parse(location.search);
}

function setInitialFilterState(location) {
  const { page, ...filters } = getSearch(location);
  if (isEmpty(filters)) return INIT_FILTER_STATE;
  return filters;
}

function setInitialPaginationState(location) {
  const { page } = getSearch(location);
  return {
    number: page || DEFAULT_PAGE,
    size: PER_PAGE
  };
}

export default function IssuesListContainer({ location, history }) {
  const { issues, issuesMeta } = useSelectAllIssues();
  const settings = useSelectSettings();
  const [filterState, setFilterState] = useState(
    setInitialFilterState(location)
  );
  const [paginationState, setPaginationState] = useState(
    setInitialPaginationState(location)
  );

  function updateUrlFromState() {
    const { pathname } = location;
    const params = { ...filterState, page: paginationState.number };
    const search = queryString.stringify(params);
    history.push({ pathname, search });
  }

  useEffect(
    () => updateUrlFromState(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(filterState), JSON.stringify(paginationState)]
  );

  function handleFilterChange(filterParam) {
    setFilterState(filterParam);
  }

  const resetFilterState = () =>
    setFilterState(setInitialFilterState(location));

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

  // Update when we have the api
  // const hasVisibleIssues = get(
  //   settings,
  //   "attributes.calculated.hasVisibleProjects"
  // );

  return issuesMeta ? (
    <>
      <h1 className="screen-reader-text">All Projects</h1>
      <EntityCollection.Issues
        issues={issues}
        issuesMeta={issuesMeta}
        filterProps={{
          filterChangeHandler: handleFilterChange,
          initialFilterState: filterState,
          resetFilterState
        }}
        paginationProps={{
          paginationClickHandler: pageChangeHandlerCreator
        }}
        bgColor="neutral05"
      />
      {/* Replace true with hasVisibleIssues once we have the setting */}
      {true && (
        <Layout.ButtonNavigation
          showProjectCollections
          showProjects={false}
          grayBg={false}
        />
      )}
    </>
  ) : null;
}

IssuesListContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
