import React, { useState } from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/groupBy";
import { commonActions as commonActionsHelper } from "actions/helpers";
import lh from "helpers/linkHandler";
import Annotation from "global/components/Annotation";
import Overlay from "global/components/Overlay";
import EmptyMessage from "reader/components/notes/EmptyMessage";
import { useDispatchAnnotations, useSelectAnnotations } from "hooks";
import withReadingGroups from "hoc/with-reading-groups";

const INITIAL_FORMATS = ["highlight", "annotation", "bookmark"];
const INITIAL_VISIBLE_FILTER_STATE = {
  keyword: "",
  textSection: "",
  readingGroupMembership: ""
};
const DEFAULT_PAGE = 1;
const PER_PAGE = 20;

function setInitialFilterState(text) {
  return {
    orphaned: false,
    text: text?.id,
    formats: [...INITIAL_FORMATS],
    ...INITIAL_VISIBLE_FILTER_STATE
  };
}

function setInitialPaginationState() {
  return {
    number: DEFAULT_PAGE,
    size: PER_PAGE
  };
}

function getSectionName(text, sectionId) {
  const { sectionsMap } = text.attributes;
  const section = sectionsMap.find(s => s.id === sectionId);
  if (!section) return null;
  return section.name;
}

function ReaderFullNotesContainer({
  currentAnnotationOverlayReadingGroup: currentGroupId,
  readingGroups,
  text,
  match,
  history,
  dispatch,
  closeCallback
}) {
  const [filterState, setFilterState] = useState(setInitialFilterState(text));
  const [paginationState, setPaginationState] = useState(
    setInitialPaginationState(location)
  );

  useDispatchAnnotations(
    filterState,
    paginationState,
    currentGroupId,
    "reader",
    true
  );
  const {
    annotations,
    annotationsMeta,
    annotationsLoaded
  } = useSelectAnnotations(currentGroupId, "reader", true);

  const commonActions = commonActionsHelper(dispatch);
  const readingGroup =
    readingGroups.find(group => group.id === currentGroupId) || "me";

  function mapAnnotationsToSections() {
    const annotationGroups = groupBy(annotations, "attributes.textSectionId");
    const out = [];

    text.attributes.spine.map(sectionId => {
      if (!annotationGroups[sectionId]) return null;
      return out.push({
        sectionId,
        name: getSectionName(text, sectionId),
        annotations: annotationGroups[sectionId]
      });
    });

    return out;
  }

  function handleVisitAnnotation(annotation) {
    const { textSectionId } = annotation.attributes;
    const url = lh.link(
      "readerSection",
      match.params.textId,
      textSectionId,
      `#annotation-${annotation.id}`
    );

    commonActions.panelToggle("notes");
    commonActions.showMyNotes();
    history.push(url);
  }

  function handleFilterChange(filterParam) {
    setFilterState(prevState => ({ ...prevState, ...filterParam }));
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

  function getMemberships() {
    if (readingGroup === "me") return [];
    return readingGroup.relationships.readingGroupMemberships;
  }

  function getOverlayPropsForGroup() {
    return {
      title: readingGroup === "me" ? "My Notes" : readingGroup.attributes.name,
      subtitle: readingGroup === "me" ? null : "All notes for group:",
      icon: readingGroup === "me" ? "notes24" : "readingGroup24"
    };
  }

  function filtersHaveChanged() {
    const initialState = JSON.stringify(setInitialFilterState(text));
    const currentState = JSON.stringify(filterState);
    return initialState !== currentState;
  }

  function renderEmptyMessage() {
    const filtersChanged = filtersHaveChanged();
    if (filtersChanged) return <EmptyMessage.NoResults />;
    if (readingGroup === "me") return <EmptyMessage.TextNotAnnotatedByMe />;
    return <EmptyMessage.TextNotAnnotatedByGroup readingGroup={readingGroup} />;
  }

  if (!annotationsLoaded || !annotations || !annotationsMeta) return null;

  const sortedAnnotations = mapAnnotationsToSections();
  const hasSortedAnnotations = !!sortedAnnotations.length;
  const memberships = getMemberships();

  return (
    <Overlay
      closeCallback={closeCallback}
      contentWidth={950}
      {...getOverlayPropsForGroup()}
    >
      <Annotation.NoteFilter
        filterChangeHandler={handleFilterChange}
        pagination={annotationsMeta.pagination}
        initialFilterState={INITIAL_VISIBLE_FILTER_STATE}
        memberships={memberships}
        sections={text.attributes.sectionsMap}
        showSearch
      />
      {!hasSortedAnnotations && renderEmptyMessage()}
      {hasSortedAnnotations && (
        <Annotation.List.GroupedBySection
          handleVisitAnnotation={handleVisitAnnotation}
          groupedAnnotations={sortedAnnotations}
          pagination={annotationsMeta.pagination}
          paginationClickHandler={pageChangeHandlerCreator}
        />
      )}
    </Overlay>
  );
}

ReaderFullNotesContainer.propTypes = {
  text: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired,
  readingGroups: PropTypes.array,
  currentAnnotationOverlayReadingGroup: PropTypes.string
};

export default withReadingGroups(ReaderFullNotesContainer);
