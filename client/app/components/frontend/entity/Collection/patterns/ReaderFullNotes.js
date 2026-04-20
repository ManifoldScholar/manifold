import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { get, isEmpty } from "lodash-es";
import Annotation from "components/global/Annotation";
import EntityCollection from "../EntityCollection";
import EmptyMessage from "components/reader/notes/EmptyMessage";

function ReaderFullNotesEntityCollection({
  groupedAnnotations,
  readingGroup,
  handleVisitAnnotation,
  annotationsMeta,
  filterProps,
  filtersChanged,
  paginationProps,
  onDelete,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  const hasSortedAnnotations = !!groupedAnnotations.length;

  function renderEmptyMessage() {
    if (filtersChanged) return <EmptyMessage.NoResults />;
    if (readingGroup === "me") return <EmptyMessage.TextNotAnnotatedByMe />;
    if (readingGroup === "orphaned")
      return <EmptyMessage.NoOrphanedAnnotations />;
    return <EmptyMessage.TextNotAnnotatedByGroup readingGroup={readingGroup} />;
  }

  return (
    <EntityCollection
      filterProps={filterProps}
      countProps={
        isEmpty(annotationsMeta)
          ? {}
          : {
              pagination: get(annotationsMeta, "pagination"),
              unit: t("glossary.note", {
                count: annotationsMeta?.pagination?.totalCount || 0
              })
            }
      }
      BodyComponent={() => (
        <>
          {hasSortedAnnotations && (
            <Annotation.List.GroupedBySection
              handleVisitAnnotation={handleVisitAnnotation}
              groupedAnnotations={groupedAnnotations}
              onDelete={onDelete}
            />
          )}
          {!hasSortedAnnotations && renderEmptyMessage()}
        </>
      )}
      paginationProps={
        !hasSortedAnnotations
          ? {}
          : {
              pagination: get(annotationsMeta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

ReaderFullNotesEntityCollection.displayName =
  "Frontend.Entity.Collection.ReaderFullNotes";

ReaderFullNotesEntityCollection.propTypes = {
  readingGroup: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  annotations: PropTypes.array,
  annotationsMeta: PropTypes.object,
  filterProps: PropTypes.object,
  isFiltered: PropTypes.bool,
  paginationProps: PropTypes.object
};

export default ReaderFullNotesEntityCollection;
