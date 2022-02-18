import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import isEmpty from "lodash/isEmpty";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { pageChangeHandlerCreator } from "helpers/pageChangeHandlerCreator";
import { useDispatchAnnotations, useSelectAnnotations } from "hooks";

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

function ReadingGroupAnnotationsContainer({
  readingGroup,
  match,
  location,
  history
}) {
  const [filterState, setFilterState] = useState(
    setInitialFilterState(location)
  );
  const [paginationState, setPaginationState] = useState(
    setInitialPaginationState(location)
  );

  useEffect(
    () => {
      const { pathname } = location;
      const params = { ...filterState, page: paginationState.number };
      const search = queryString.stringify(params);
      history.push({ pathname, search });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterState, paginationState]
  );

  useDispatchAnnotations(
    filterState,
    paginationState,
    match.params.id,
    "frontend"
  );
  const { annotations, annotationsMeta } = useSelectAnnotations(
    "group",
    "frontend"
  );

  function handleFilterChange(filterParam) {
    setFilterState(filterParam);
  }

  function handlePageChange(pageParam) {
    setPaginationState(prevState => {
      return { ...prevState, number: pageParam };
    });
  }

  const {
    annotatedTexts: texts,
    readingGroupMemberships: memberships
  } = readingGroup.relationships;
  const isFiltered =
    "text" in filterState || "readingGroupMembership" in filterState;

  return (
    <div className="group-page-body">
      <EntityCollection.GroupAnnotations
        readingGroup={readingGroup}
        annotations={annotations}
        annotationsMeta={annotationsMeta}
        filterProps={{
          onFilterChange: handleFilterChange,
          init: filterState,
          reset: {},
          options: { memberships, texts, hideSearch: true }
        }}
        isFiltered={isFiltered}
        paginationProps={{
          paginationClickHandler: pageChangeHandlerCreator(handlePageChange)
        }}
        nested
      />
    </div>
  );
}

ReadingGroupAnnotationsContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default ReadingGroupAnnotationsContainer;
