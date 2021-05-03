import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import HeadContent from "global/components/HeadContent";
import GroupsTable from "frontend/components/reading-group/Table/Groups";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";
import { useDispatchMyReadingGroups, useSelectMyReadingGroups } from "hooks";

const DEFAULT_PAGE = 1;
const PER_PAGE = 20;

function getSearch(location) {
  return queryString.parse(location.search);
}

function setInitialFilterState(location) {
  const { page, ...filters } = getSearch(location);
  if (isEmpty(filters)) return {};
  return filters;
}

function setInitialPaginationState(location) {
  const { page } = getSearch(location);
  return {
    number: page || DEFAULT_PAGE,
    size: PER_PAGE
  };
}

function ReadingGroupsListContainer({
  location,
  history,
  projectBackLink,
  route
}) {
  const [filterState, setFilterState] = useState(
    setInitialFilterState(location)
  );
  const [paginationState, setPaginationState] = useState(
    setInitialPaginationState(location)
  );

  function updateUrlFromState() {
    const pathname = lh.link("frontendMyReadingGroups");
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

  useDispatchMyReadingGroups(filterState, paginationState, fetchVersion);
  const { readingGroups, readingGroupsMeta } = useSelectMyReadingGroups();

  function handleFilterChange(filterParam) {
    setFilterState(filterParam);
  }

  function handleFilterReset() {
    setInitialFilterState(location);
  }

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
          {projectBackLink}
          <GroupsHeading />
          {showTable && (
            <GroupsTable
              groups={readingGroups}
              pagination={get(readingGroupsMeta, "pagination")}
              onPageClick={pageChangeHandlerCreator}
              initialFilterState={filterState}
              resetFilterState={handleFilterReset}
              filterChangeHandler={handleFilterChange}
            />
          )}
          <JoinBox onJoin={() => setFetchVersion(current => current + 1)} />
        </div>
      </section>
      {childRoutes(route, childRouteProps)}
    </>
  );
}

ReadingGroupsListContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  settings: PropTypes.object,
  projectBackLink: PropTypes.node
};

export default ReadingGroupsListContainer;
