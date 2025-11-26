import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import groupBy from "lodash/groupBy";
import isEqual from "lodash/isEqual";
import { meAPI, readingGroupsAPI, requests } from "api";
import { commonActions } from "actions/helpers";
import lh from "helpers/linkHandler";
import Overlay from "global/components/Overlay";
import {
  useFetch,
  useFilterState,
  usePaginationState,
  useListFilters,
  useFromStore
} from "hooks";
import withReadingGroups from "hoc/withReadingGroups";
import EntityCollection from "frontend/components/entity/Collection";

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

function ReaderFullNotesContainer({
  currentAnnotationOverlayReadingGroup: currentGroupId,
  readingGroups,
  text,
  closeCallback,
  readingGroupsLoaded
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { textId } = useParams();
  const navigate = useNavigate();

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
  const fetchKey = isMe
    ? requests.rMyFilteredAnnotationsForText
    : requests.rReadingGroupFilteredAnnotationsForText;
  const args = isMe
    ? [filters, pagination]
    : [currentGroupId, filters, pagination];
  const { data: annotations, meta, refresh } = useFetch({
    request: [endpoint, ...args],
    options: { fetchKey }
  });

  const actions = commonActions(dispatch);
  const readingGroup =
    readingGroups.find(group => group.id === currentGroupId) || currentGroupId;

  const visibilityFilters = useFromStore({
    path: "ui.transitory.visibility.visibilityFilters"
  });

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
      visibilityFilters: { ...visibilityFilters, ...annotationFilter }
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

  if (!annotations || !meta || !readingGroupsLoaded) return null;

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
        refresh={refresh}
        nested
      />
    </Overlay>
  );
}

ReaderFullNotesContainer.displayName = "Reader.FullNotes";

export default withReadingGroups(ReaderFullNotesContainer);
