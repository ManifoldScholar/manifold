import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import isEmpty from "lodash/isEmpty";
import HeadContent from "global/components/HeadContent";
import Utility from "global/components/utility";
import Annotation from "global/components/Annotation";
import {
  useDispatchMyAnnotations,
  useSelectMyAnnotations,
  useDispatchMyAnnotatedTexts,
  useSelectMyAnnotatedTexts
} from "hooks";

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

  useDispatchMyAnnotations(filterState, paginationState);
  useDispatchMyAnnotatedTexts();
  const { annotations, annotationsMeta } = useSelectMyAnnotations();
  const annotatedTexts = useSelectMyAnnotatedTexts();

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

  if (!annotations || !annotationsMeta) return null;

  const hasAnnotations = annotations.length > 0;
  const hasAnnotatedTexts = hasAnnotations && annotatedTexts?.length > 0;
  const isFiltered = "text" in filterState;

  return (
    <>
      <HeadContent title="My Notes + Comments" appendTitle />
      <section className="bg-white">
        <div className="container">
          <header className="entity-section-wrapper__heading entity-section-wrapper__heading--wide section-heading">
            <div className="main">
              <Utility.IconComposer size={48} icon="NotesUnique" />
              <div className="body">
                <h1 className="title">My Notes + Comments</h1>
              </div>
            </div>
          </header>
          {hasAnnotatedTexts && (
            <Annotation.NoteFilter
              texts={annotatedTexts}
              updateAnnotations={handleFilterChange}
              initialFilterState={filterState}
              pagination={annotationsMeta.pagination}
            />
          )}
          <div
            className="entity-section-wrapper__body"
            style={{ marginTop: 40 }}
          >
            {hasAnnotations && (
              <Annotation.List.Default
                annotations={annotations}
                pagination={annotationsMeta.pagination}
                paginationClickHandler={pageChangeHandlerCreator}
                showCommentsToggleAsBlock
              />
            )}
            {!hasAnnotations && (
              <Annotation.List.Placeholder
                isGroup={false}
                isFiltered={isFiltered}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

MyAnnotationsContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default MyAnnotationsContainer;
