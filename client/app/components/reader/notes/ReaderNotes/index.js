import { cloneElement, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router";
import { readingGroupsAPI, meAPI } from "api";
import { groupBy, isString } from "lodash-es";
import {
  useFetch,
  useFilterState,
  useReadingGroups,
  useLoaderEntity
} from "hooks";
import { ReaderContext } from "app/contexts";

const DEFAULT_FORMATS = ["annotation"];

function getSectionName(text, sectionId) {
  const { sectionsMap } = text.attributes;
  const section = sectionsMap.find(s => s.id === sectionId);
  if (!section) return null;
  return section.name;
}

function ReaderNotesContainer({ children }) {
  const {
    readingGroups,
    currentAnnotationOverlayReadingGroup: currentGroup,
    setAnnotationOverlayReadingGroup
  } = useReadingGroups();

  const { visibilityFilters, dispatch } = useContext(ReaderContext);

  const { textId, sectionId } = useParams();
  const navigate = useNavigate();
  const text = useLoaderEntity("texts");
  const section = useLoaderEntity("textSections");

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
    condition: showMyAnnotations
  });
  const { data: rgAnnotations, meta: rgMeta, loaded: rgLoaded } = useFetch({
    request: [readingGroupsAPI.annotations, groupId, fetchFilters],
    condition: !showMyAnnotations
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

  const handleVisitAnnotation = annotation => {
    const { textSectionId, currentUserIsCreator } = annotation.attributes;
    const url = `/read/${textId}/section/${textSectionId}#annotation-${annotation.id}`;
    dispatch({ type: "PANEL_TOGGLE", payload: "notes" });
    const annotationFilter = currentUserIsCreator
      ? { annotation: { ...visibilityFilters.annotation, yours: true } }
      : { annotation: { ...visibilityFilters.annotation, others: true } };
    dispatch({
      type: "VISIBILITY_FILTERS_CHANGE",
      payload: { ...visibilityFilters, ...annotationFilter }
    });
    navigate(url);
  };

  const handleSeeAllClick = event => {
    event.preventDefault();
    navigate(`/read/${textId}/section/${sectionId}#group-annotations`);
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
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default ReaderNotesContainer;
