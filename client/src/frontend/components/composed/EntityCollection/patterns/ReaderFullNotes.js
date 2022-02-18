import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Annotation from "global/components/Annotation";
import EntityCollection from "../EntityCollection";
import EmptyMessage from "reader/components/notes/EmptyMessage";
import { ListFilters } from "global/components/list";

function ReaderFullNotesEntityCollection({
  groupedAnnotations,
  readingGroup,
  handleVisitAnnotation,
  annotationsMeta,
  filterProps,
  filtersChanged,
  paginationProps,
  ...passThroughProps
}) {
  const hasSortedAnnotations = !!groupedAnnotations.length;

  function renderEmptyMessage() {
    if (filtersChanged) return <EmptyMessage.NoResults />;
    if (readingGroup === "me") return <EmptyMessage.TextNotAnnotatedByMe />;
    return <EmptyMessage.TextNotAnnotatedByGroup readingGroup={readingGroup} />;
  }

  return (
    <EntityCollection
      UtilityComponent={() => <ListFilters {...filterProps} />}
      countProps={
        isEmpty(annotationsMeta)
          ? {}
          : {
              pagination: get(annotationsMeta, "pagination"),
              unit: "note"
            }
      }
      BodyComponent={() => (
        <>
          {hasSortedAnnotations && (
            <Annotation.List.GroupedBySection
              handleVisitAnnotation={handleVisitAnnotation}
              groupedAnnotations={groupedAnnotations}
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
  "Frontend.Composed.EntityCollection.ReaderFullNotes";

ReaderFullNotesEntityCollection.propTypes = {
  readingGroup: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  annotations: PropTypes.array,
  annotationsMeta: PropTypes.object,
  filterProps: PropTypes.object,
  isFiltered: PropTypes.bool,
  paginationProps: PropTypes.object
};

export default ReaderFullNotesEntityCollection;
