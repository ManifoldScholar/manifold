import React, { useState } from "react";
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
const INIT_PAGINATION_STATE = {
  number: DEFAULT_PAGE,
  size: PER_PAGE
};
const INIT_FILTER_STATE = {
  formats: ["highlight", "annotation", "bookmark"]
};

function MyAnnotationsContainer() {
  const [filterState, setFilterState] = useState(INIT_FILTER_STATE);
  const [paginationState, setPaginationState] = useState(INIT_PAGINATION_STATE);

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
            <div style={{ marginTop: 50, marginBottom: 40 }}>
              <Annotation.NoteFilter
                texts={annotatedTexts}
                updateAnnotations={handleFilterChange}
                initialFilterState={filterState}
                pagination={annotationsMeta.pagination}
              />
            </div>
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

export default MyAnnotationsContainer;
