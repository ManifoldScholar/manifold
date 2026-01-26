import { cloneElement, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, meAPI, requests } from "api";
import groupBy from "lodash/groupBy";
import isString from "lodash/isString";
import { commonActions } from "actions/helpers";
import lh from "helpers/linkHandler";
import { useFetch, useFilterState, useFromStore } from "hooks";
import withReadingGroups from "hoc/withReadingGroups";

const DEFAULT_FORMATS = ["annotation"];

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
  const navigate = useNavigate();
  const text = useFromStore({
    entityType: "texts",
    action: "grab",
    id: textId
  });
  const section = useFromStore({
    entityType: "textSections",
    action: "grab",
    id: sectionId
  });
  const visibilityFilters = useFromStore({
    path: "ui.transitory.visibility.visibilityFilters"
  });

  const baseFilters = {
    orphaned: currentGroup === "orphaned",
    text: text?.id,
    formats: [...DEFAULT_FORMATS],
    readingGroup: currentGroup === "orphaned" ? "me" : currentGroup
  };
  const [filters, setFilters] = useFilterState(baseFilters);
  const groupId = filters.readingGroup;
  const fetchFilters = useMemo(() => {
    const { readingGroup, ...rest } = filters;
    return rest;
  }, [filters]);
  const showMyAnnotations = groupId === "me";

  const { data: myAnnotations, meta: myMeta, loaded: myLoaded } = useFetch({
    request: [meAPI.annotations, fetchFilters],
    condition: showMyAnnotations,
    options: { fetchKey: requests.rMyFilteredAnnotationsForText }
  });
  const { data: rgAnnotations, meta: rgMeta, loaded: rgLoaded } = useFetch({
    request: [readingGroupsAPI.annotations, groupId, fetchFilters],
    condition: !showMyAnnotations,
    options: { fetchKey: requests.rReadingGroupFilteredAnnotationsForText }
  });

  const annotations = showMyAnnotations ? myAnnotations : rgAnnotations;
  const meta = showMyAnnotations ? myMeta : rgMeta;
  const loaded = showMyAnnotations ? myLoaded : rgLoaded;

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
  const actions = commonActions(dispatch);

  const handleVisitAnnotation = annotation => {
    const { textSectionId, currentUserIsCreator } = annotation.attributes;
    const url = lh.link(
      "readerSection",
      textId,
      textSectionId,
      `#annotation-${annotation.id}`
    );
    actions.panelToggle("notes");
    const annotationFilter = currentUserIsCreator
      ? { annotation: { ...visibilityFilters.annotation, yours: true } }
      : { annotation: { ...visibilityFilters.annotation, others: true } };
    actions.visibilityChange({
      visibilityFilters: {
        ...visibilityFilters,
        ...annotationFilter
      }
    });
    navigate(url);
  };

  const handleSeeAllClick = event => {
    event.preventDefault();
    navigate(lh.link("readerSection", textId, sectionId, "#group-annotations"));
  };

  if (!annotations || !meta || !loaded) return null;

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
  return cloneElement(children, childProps);
}

ReaderNotesContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  readingGroups: PropTypes.array,
  setAnnotationOverlayReadingGroup: PropTypes.func.isRequired,
  currentAnnotationOverlayReadingGroup: PropTypes.string
};

export default withReadingGroups(ReaderNotesContainer);
