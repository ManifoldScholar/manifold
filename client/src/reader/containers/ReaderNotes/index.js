import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import groupBy from "lodash/groupBy";
import isString from "lodash/isString";
import { commonActions as commonActionsHelper } from "actions/helpers";
import lh from "helpers/linkHandler";
import {
  useDispatchAnnotations,
  useSelectAnnotations,
  useGrabCurrentText,
  useGrabCurrentTextSection
} from "hooks";
import withReadingGroups from "hoc/with-reading-groups";

const DEFAULT_FORMATS = ["highlight", "annotation", "bookmark"];

function setInitialFilterState(text, currentGroup) {
  return {
    orphaned: false,
    text: text?.id,
    formats: [...DEFAULT_FORMATS],
    readingGroup: currentGroup
  };
}

function getSectionName(text, sectionId) {
  const { sectionsMap } = text.attributes;
  const section = sectionsMap.find(s => s.id === sectionId);
  if (!section) return null;
  return section.name;
}

function ReaderNotesContainer({
  match,
  history,
  readingGroups,
  currentAnnotationOverlayReadingGroup: currentGroup,
  setAnnotationOverlayReadingGroup,
  children
}) {
  const dispatch = useDispatch();
  const text = useGrabCurrentText(match);
  const section = useGrabCurrentTextSection(match);
  const [filterState, setFilterState] = useState(
    setInitialFilterState(text, currentGroup)
  );

  const { readingGroup, ...fetchFilters } = filterState;

  useDispatchAnnotations(fetchFilters, {}, readingGroup, "reader", true);
  const { annotations, annotationsMeta, loaded } = useSelectAnnotations(
    readingGroup,
    "reader",
    true
  );

  const commonActions = commonActionsHelper(dispatch);

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

  function handleFilterChange(label, value) {
    const filters = { ...filterState };
    filters[label] = value;
    setFilterState(filters);
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

  function handleSeeAllClick(event) {
    event.preventDefault();
    const url = lh.link(
      "readerSection",
      match.params.textId,
      match.params.sectionId,
      "#group-annotations"
    );
    history.push(url);
  }

  if (!loaded || !annotations || !annotationsMeta) return null;

  const sortedAnnotations = mapAnnotationsToSections();

  const childProps = {
    sortedAnnotations,
    section,
    handleVisitAnnotation,
    handleFilterChange,
    handleSeeAllClick,
    setAnnotationOverlayReadingGroup,
    annotated: annotationsMeta.annotated,
    filters: filterState,
    defaultFormats: DEFAULT_FORMATS,
    readingGroups
  };

  if (!children) return null;
  if (isString(children.type)) return children;
  return React.cloneElement(children, childProps);
}

ReaderNotesContainer.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  readingGroups: PropTypes.array,
  setAnnotationOverlayReadingGroup: PropTypes.func.isRequired,
  currentAnnotationOverlayReadingGroup: PropTypes.string
};

export default withReadingGroups(ReaderNotesContainer);
