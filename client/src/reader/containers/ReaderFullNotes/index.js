import React, { useMemo } from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/groupBy";
import isEqual from "lodash/isEqual";
import { meAPI, readingGroupsAPI } from "api";
import { commonActions as commonActionsHelper } from "actions/helpers";
import lh from "helpers/linkHandler";
import Overlay from "global/components/Overlay";
import { useFetch, useFilterState, usePaginationState } from "hooks";
import withReadingGroups from "hoc/withReadingGroups";
import EntityCollection from "frontend/components/composed/EntityCollection";

const INITIAL_FORMATS = ["highlight", "annotation", "bookmark"];
const INITIAL_VISIBLE_FILTER_STATE = {
  keyword: "",
  textSection: "",
  readingGroupMembership: ""
};

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
  const initialFilters = useMemo(() => {
    return {
      orphaned: false,
      text: text?.id,
      formats: [...INITIAL_FORMATS],
      ...INITIAL_VISIBLE_FILTER_STATE
    };
  }, [text]);

  const [pagination, setPageNumber] = usePaginationState();
  const [filters, setFilters] = useFilterState(initialFilters);

  const me = currentGroupId === "me";
  const endpoint = me ? meAPI.annotations : readingGroupsAPI.annotations;
  const args = me
    ? [filters, pagination]
    : [currentGroupId, filters, pagination];
  const { data: annotations, meta } = useFetch({
    request: [endpoint, ...args]
  });

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

  if (!annotations || !meta) return null;

  const sortedAnnotations = mapAnnotationsToSections();
  const memberships = getMemberships();

  return (
    <Overlay
      closeCallback={closeCallback}
      contentWidth={950}
      {...getOverlayPropsForGroup()}
    >
      <EntityCollection.ReaderFullNotes
        handleVisitAnnotation={handleVisitAnnotation}
        annotationsMeta={meta}
        groupedAnnotations={sortedAnnotations}
        filtersChanged={!isEqual(filters, initialFilters)}
        readingGroup={readingGroup}
        filterProps={{
          memberships,
          sections: text.attributes.sectionsMap,
          filterChangeHandler: param => setFilters({ newState: param }),
          initialFilterState: filters,
          resetFilterState: initialFilters,
          showSearch: true,
          pagination: meta.pagination
        }}
        paginationProps={{
          paginationClickHandler: page => () => setPageNumber(page),
          paginationTarget: "#"
        }}
        nested
      />
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
