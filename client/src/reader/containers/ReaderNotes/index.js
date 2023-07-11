import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, meAPI, requests } from "api";
import groupBy from "lodash/groupBy";
import isString from "lodash/isString";
import { commonActions as commonActionsHelper } from "actions/helpers";
import lh from "helpers/linkHandler";
import { useFetch, useFilterState, useFromStore } from "hooks";
import withReadingGroups from "hoc/withReadingGroups";

const DEFAULT_FORMATS = ["highlight", "annotation", "bookmark"];

function getSectionName(text, sectionId) {
  const { sectionsMap } = text.attributes;
  const section = sectionsMap.find(s => s.id === sectionId);
  if (!section) return null;
  return section.name;
}

function ReaderNotesContainer({
  readingGroups,
  currentAnnotationOverlayReadingGroup: currentGroup,
  setAnnotationOverlayReadingGroup,
  children
}) {
  const { textId, sectionId } = useParams();
  const history = useHistory();
  const text = useFromStore("texts", "grab", textId);
  const section = useFromStore("textSections", "grab", sectionId);

  const baseFilters = useMemo(
    () => ({
      orphaned: !!(currentGroup === "orphaned"),
      text: text?.id,
      formats: [...DEFAULT_FORMATS],
      readingGroup: currentGroup === "orphaned" ? "me" : currentGroup
    }),
    [text, currentGroup]
  );
  const [filters, setFilters] = useFilterState(baseFilters);
  const fetchFilters = useMemo(() => {
    const { readingGroup, ...rest } = filters;
    return rest;
  }, [filters]);
  const groupId = useMemo(() => {
    return filters.readingGroup;
  }, [filters]);
  const showMyAnnotations = groupId === "me";

  const { data: myAnnotations, meta: myMeta } = useFetch({
    request: [meAPI.annotations, fetchFilters],
    condition: showMyAnnotations,
    options: { fetchKey: requests.rMyFilteredAnnotationsForText }
  });
  const { data: rgAnnotations, meta: rgMeta } = useFetch({
    request: [readingGroupsAPI.annotations, groupId, fetchFilters],
    condition: !showMyAnnotations,
    options: { fetchKey: requests.rReadingGroupFilteredAnnotationsForText }
  });

  const annotations = showMyAnnotations ? myAnnotations : rgAnnotations;
  const meta = showMyAnnotations ? myMeta : rgMeta;

  function mapAnnotationsToSections() {
    const annotationGroups = groupBy(annotations, "attributes.textSectionId");

    return text.attributes.spine
      .map(id => {
        if (!annotationGroups[id]) return null;
        return {
          id,
          name: getSectionName(text, id),
          annotations: annotationGroups[id]
        };
      })
      .filter(Boolean);
  }

  const dispatch = useDispatch();
  const commonActions = commonActionsHelper(dispatch);

  function handleVisitAnnotation(annotation) {
    const { textSectionId } = annotation.attributes;
    const url = lh.link(
      "readerSection",
      textId,
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
      textId,
      sectionId,
      "#group-annotations"
    );
    history.push(url);
  }

  if (!annotations || !meta) return null;

  const sortedAnnotations = mapAnnotationsToSections();

  const childProps = {
    sortedAnnotations,
    section,
    handleVisitAnnotation,
    handleFilterChange: updates => {
      setFilters({ newState: { ...filters, ...updates } });
    },
    handleSeeAllClick,
    setAnnotationOverlayReadingGroup,
    annotated: meta.annotated,
    filters,
    defaultFormats: DEFAULT_FORMATS,
    readingGroups
  };

  if (!children) return null;
  if (isString(children.type)) return children;
  return React.cloneElement(children, childProps);
}

ReaderNotesContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  readingGroups: PropTypes.array,
  setAnnotationOverlayReadingGroup: PropTypes.func.isRequired,
  currentAnnotationOverlayReadingGroup: PropTypes.string
};

export default withReadingGroups(ReaderNotesContainer);
