import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import isEmpty from "lodash/isEmpty";
import Annotation from "global/components/Annotation";

import {
  useDispatchReadingGroupAnnotations,
  useSelectReadingGroupAnnotations
} from "hooks";

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

  useDispatchReadingGroupAnnotations(match, filterState, paginationState);
  const { annotations, annotationsMeta } = useSelectReadingGroupAnnotations();

  function handleFilterChange(filterParam) {
    setFilterState(filterParam);
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

  if (!readingGroup || !annotations || !annotationsMeta) return null;

  const {
    annotatedTexts,
    readingGroupMemberships: memberships
  } = readingGroup.relationships;
  const hasAnnotations = annotations.length > 0;
  const isFiltered =
    "text" in filterState || "readingGroupMembership" in filterState;

  return (
    <>
      <div className="group-page-body">
        <Annotation.NoteFilter
          memberships={memberships}
          texts={annotatedTexts}
          updateAnnotations={handleFilterChange}
          initialFilterState={filterState}
          pagination={annotationsMeta.pagination}
        />
      </div>
      <div className="entity-section-wrapper__body" style={{ marginTop: 40 }}>
        {hasAnnotations && (
          <Annotation.List.Default
            annotations={annotations}
            pagination={annotationsMeta.pagination}
            paginationClickHandler={pageChangeHandlerCreator}
            showCommentsToggleAsBlock
          />
        )}
        {!hasAnnotations && (
          <Annotation.List.Placeholder isGroup isFiltered={isFiltered} />
        )}
      </div>
    </>
  );
}

ReadingGroupAnnotationsContainer.displayName =
  "ReadingGroup.AnnotationContainer";

ReadingGroupAnnotationsContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default ReadingGroupAnnotationsContainer;
