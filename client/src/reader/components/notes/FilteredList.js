import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import Partial from "./partial";
import EmptyMessage from "./EmptyMessage";
import { useTranslation } from "react-i18next";

export default function FilteredList({
  section,
  sortedAnnotations = [],
  handleSeeAllClick,
  handleFilterChange,
  handleVisitAnnotation,
  filters,
  defaultFormats,
  readingGroups,
  setAnnotationOverlayReadingGroup
}) {
  const { t } = useTranslation();

  const hasAnnotations = sortedAnnotations.length > 0;
  const hasReadingGroups = readingGroups?.length > 0;
  const selectedGroup = filters.orphaned ? "orphaned" : filters.readingGroup;
  const formatFiltersChanged = filters.formats.length !== defaultFormats.length;

  const renderEmptyMessage = () => {
    if (formatFiltersChanged) return <EmptyMessage.NoResults />;
    if (selectedGroup === "me") return <EmptyMessage.TextNotAnnotatedByMe />;
    if (selectedGroup === "orphaned")
      return <EmptyMessage.NoOrphanedAnnotations />;
    return <EmptyMessage.TextNotAnnotatedByGroup />;
  };

  return (
    <div className="notes-filtered-list">
      <div className="notes-filtered-list__header">
        <div
          className={classNames({
            "notes-filtered-list__header-end": true,
            "notes-filtered-list__header-end--has-select": hasReadingGroups
          })}
        >
          <Partial.GroupFilter
            filterChangeHandler={handleFilterChange}
            selectedGroup={selectedGroup}
            readingGroups={readingGroups}
            setAnnotationOverlayReadingGroup={setAnnotationOverlayReadingGroup}
          />
          <button
            onClick={handleSeeAllClick}
            className="notes-filtered-list__see-all button-primary button-primary--dull button-primary--rounded"
          >
            <span className="button-primary__text">{t("actions.see_all")}</span>
            <IconComposer
              icon="link24"
              size="default"
              className="notes-filtered-list__see-all-icon button-primary__icon"
              svgProps={{ role: "presentation" }}
            />
          </button>
        </div>
      </div>
      {hasAnnotations ? (
        <ul className="notes-filtered-list__section-list">
          {sortedAnnotations.map(group => (
            <Partial.Group
              key={group.id}
              annotations={group.annotations}
              sectionName={group.name}
              readerSection={section}
              visitHandler={handleVisitAnnotation}
              showAnnotationCreator={
                !(selectedGroup === "me" || selectedGroup === "orphaned")
              }
            />
          ))}
        </ul>
      ) : (
        renderEmptyMessage()
      )}
    </div>
  );
}

FilteredList.displayName = "Notes.FilteredList";

FilteredList.propTypes = {
  section: PropTypes.object,
  sortedAnnotations: PropTypes.array,
  handleSeeAllClick: PropTypes.func,
  handleFilterChange: PropTypes.func,
  handleVisitAnnotation: PropTypes.func,
  currentSectionId: PropTypes.string,
  filters: PropTypes.object,
  defaultFormats: PropTypes.array,
  annotated: PropTypes.bool,
  loaded: PropTypes.bool,
  readingGroups: PropTypes.array,
  setAnnotationOverlayReadingGroup: PropTypes.func
};
