import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import isEmpty from "lodash/isEmpty";
import HeadContent from "global/components/HeadContent";
import EntityCollection from "frontend/components/composed/EntityCollection";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";
import {
  useDispatchAnnotations,
  useSelectAnnotations,
  useDispatchMyAnnotatedTexts,
  useSelectMyAnnotatedTexts
} from "hooks";
import { pageChangeHandlerCreator } from "helpers/pageChangeHandlerCreator";

const DEFAULT_PAGE = 1;
const PER_PAGE = 10;
const INIT_FILTER_STATE = {
  formats: ["highlight", "annotation", "bookmark"]
};

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

function MyAnnotationsContainer({ location, history }) {
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

  useDispatchAnnotations(filterState, paginationState, "me", "frontend");
  useDispatchMyAnnotatedTexts();
  const { annotations, annotationsMeta } = useSelectAnnotations(
    "me",
    "frontend"
  );
  const annotatedTexts = useSelectMyAnnotatedTexts();

  function handleFilterChange(filterParam) {
    setFilterState(filterParam);
  }

  function handlePageChange(pageParam) {
    setPaginationState(prevState => {
      return { ...prevState, number: pageParam };
    });
  }

  return (
    <>
      <HeadContent title="My Notes + Comments" appendTitle />
      <EntityCollection.MyAnnotations
        annotations={annotations}
        annotationsMeta={annotationsMeta}
        annotatedTexts={annotatedTexts}
        filterProps={{
          texts: annotatedTexts,
          filterChangeHandler: handleFilterChange,
          initialFilterState: filterState
        }}
        isFiltered={"text" in filterState}
        paginationProps={{
          paginationClickHandler: pageChangeHandlerCreator(handlePageChange)
        }}
      />
      <CollectionNavigation />
    </>
  );
}

MyAnnotationsContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default MyAnnotationsContainer;
