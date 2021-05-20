import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { childRoutes } from "helpers/router";
import HeadContent from "global/components/HeadContent";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";

import {
  useDispatchPublicReadingGroups,
  useSelectPublicReadingGroups
} from "hooks";
import withCurrentUser from "hoc/with-current-user";

const DEFAULT_SORT_ORDER = "";
const DEFAULT_PAGE = 1;
const PER_PAGE = 20;

function getSearch(location) {
  return queryString.parse(location.search);
}

function setInitialFilterState(location) {
  const { page, ...filters } = getSearch(location);
  if (isEmpty(filters))
    return {
      sort_order: DEFAULT_SORT_ORDER
    };
  return filters;
}

function setInitialPaginationState(location) {
  const { page } = getSearch(location);
  return {
    number: page || DEFAULT_PAGE,
    size: PER_PAGE
  };
}

function PublicReadingGroupsListContainer({
  location,
  history,
  route,
  currentUser
}) {
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
    [filterState, paginationState]
  );

  const [fetchVersion, setFetchVersion] = useState(1);

  useDispatchPublicReadingGroups(filterState, paginationState, fetchVersion);
  const { readingGroups, readingGroupsMeta } = useSelectPublicReadingGroups();

  function handleFilterChange(filterParam) {
    setFilterState(filterParam);
  }

  function handleFilterReset() {
    setInitialFilterState(location);
  }

  function handlePageChange(pageParam) {
    setPaginationState(prevState => ({ ...prevState, number: pageParam }));
  }

  const pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      handlePageChange(pageParam);
    };
  };

  function handleNewGroupSuccess() {
    updateUrlFromState();
    setFetchVersion(current => current + 1);
  }

  const childRouteProps = {
    drawer: true,
    drawerProps: {
      context: "frontend",
      size: "wide",
      position: "overlay",
      lockScroll: "always",
      closeCallback: updateUrlFromState
    },
    childProps: {
      onSuccess: handleNewGroupSuccess
    }
  };

  const showTable = readingGroups && readingGroupsMeta;

  return (
    <>
      <HeadContent title="My Reading Groups" appendTitle />
      <section>
        <div className="container groups-page-container">
          <GroupsHeading currentUser={currentUser} />
          {showTable && (
            <GroupsTable
              readingGroups={readingGroups}
              currentUser={currentUser}
              pagination={get(readingGroupsMeta, "pagination")}
              onPageClick={pageChangeHandlerCreator}
              initialFilterState={filterState}
              resetFilterState={handleFilterReset}
              filterChangeHandler={handleFilterChange}
              hideActions
              hideTags
            />
          )}
          {currentUser && (
            <JoinBox onJoin={() => setFetchVersion(current => current + 1)} />
          )}
        </div>
      </section>
      {childRoutes(route, childRouteProps)}
    </>
  );
}

PublicReadingGroupsListContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  currentUser: PropTypes.object
};

export default withCurrentUser(PublicReadingGroupsListContainer);
