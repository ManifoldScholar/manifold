import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";
import { groupBy, isEqual } from "lodash-es";
import { meAPI, readingGroupsAPI } from "api";
import Overlay from "components/global/Overlay";
import {
  useFetch,
  useFilterState,
  usePaginationState,
  useListFilters,
  useReadingGroups,
  useLoaderEntity
} from "hooks";
import { ReaderContext } from "app/contexts";
import EntityCollection from "components/frontend/entity/Collection";

const INITIAL_FORMATS = ["annotation"];
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

function ReaderFullNotesContainer({ closeCallback }) {
  const { t } = useTranslation();
  const { textId } = useParams();
  const navigate = useNavigate();
  const text = useLoaderEntity("texts");

  const { visibilityFilters, dispatch } = useContext(ReaderContext);

  const {
    readingGroups,
    currentAnnotationOverlayReadingGroup: currentGroupId
  } = useReadingGroups();

  const initialFilters = {
    orphaned: currentGroupId === "orphaned",
    text: text?.id,
    formats: [...INITIAL_FORMATS],
    ...INITIAL_VISIBLE_FILTER_STATE
  };

  const [pagination, setPageNumber] = usePaginationState();
  const [filters, setFilters] = useFilterState(initialFilters);

  const isMe = currentGroupId === "me" || currentGroupId === "orphaned";
  const endpoint = isMe ? meAPI.annotations : readingGroupsAPI.annotations;
  const args = isMe
    ? [filters, pagination]
    : [currentGroupId, filters, pagination];
  const { data: annotations, meta, refresh } = useFetch({
    request: [endpoint, ...args]
  });

  const readingGroup =
    readingGroups.find(group => group.id === currentGroupId) || currentGroupId;

  const mapAnnotationsToSections = () => {
    const annotationGroups = groupBy(annotations, "attributes.textSectionId");
    return text.attributes.spine
      .filter(sectionId => annotationGroups[sectionId])
      .map(sectionId => ({
        sectionId,
        name: getSectionName(text, sectionId),
        annotations: annotationGroups[sectionId]
      }));
  };

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

  const memberships =
    readingGroup === "me" || readingGroup === "orphaned"
      ? []
      : readingGroup?.relationships?.readingGroupMemberships || [];

  const sections = text.attributes.sectionsMap || [];

  /* eslint-disable no-nested-ternary */
  const overlayProps = {
    title: isMe
      ? currentGroupId === "orphaned"
        ? t("reader.menus.notes.orphaned_notes")
        : t("reader.menus.notes.my_notes")
      : readingGroup?.attributes?.name,
    subtitle: isMe ? null : t("reader.menus.notes.all_notes"),
    icon: isMe ? "notes24" : "readingGroup24"
  };
  /* eslint-enable no-nested-ternary */

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: initialFilters,
    options: { memberships, sections }
  });

  if (!annotations || !meta) return null;

  const sortedAnnotations = mapAnnotationsToSections();

  return (
    <Overlay
      open
      closeCallback={closeCallback}
      contentWidth={950}
      {...overlayProps}
    >
      <EntityCollection.ReaderFullNotes
        handleVisitAnnotation={handleVisitAnnotation}
        annotationsMeta={meta}
        groupedAnnotations={sortedAnnotations}
        filtersChanged={!isEqual(filters, initialFilters)}
        readingGroup={readingGroup}
        filterProps={filterProps}
        paginationProps={{
          paginationClickHandler: page => () => setPageNumber(page)
        }}
        onDelete={refresh}
        nested
      />
    </Overlay>
  );
}

ReaderFullNotesContainer.displayName = "Reader.FullNotes";

export default ReaderFullNotesContainer;
