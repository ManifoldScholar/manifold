import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Annotation from "global/components/Annotation";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "../EntityCollection";

function MyAnnotationsEntityCollection({
  annotations,
  annotationsMeta,
  annotatedTexts,
  filterProps,
  isFiltered,
  paginationProps,
  ...passThroughProps
}) {
  if (!annotations || !annotationsMeta) return null;

  const hasAnnotations = annotations.length > 0;
  const hasAnnotatedTexts = hasAnnotations && annotatedTexts?.length > 0;

  return (
    <EntityCollection
      title="My Notes + Comments"
      icon="NotesUnique"
      UtilityComponent={props =>
        hasAnnotatedTexts && (
          <Annotation.NoteFilter {...props} {...filterProps} />
        )
      }
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
          {hasAnnotations && (
            <Annotation.List.Default
              annotations={annotations}
              showCommentsToggleAsBlock
            />
          )}
          {!hasAnnotations && isFiltered && (
            <EntityCollectionPlaceholder.FilteredAnnotations />
          )}
          {!hasAnnotations && !isFiltered && (
            <EntityCollectionPlaceholder.MyAnnotations />
          )}
        </>
      )}
      paginationProps={
        !hasAnnotations
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

MyAnnotationsEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.MyAnnotations";

MyAnnotationsEntityCollection.propTypes = {
  annotations: PropTypes.object,
  annotationsMeta: PropTypes.object,
  annotatedTexts: PropTypes.object,
  filterProps: PropTypes.object,
  isFiltered: PropTypes.bool,
  paginationProps: PropTypes.object
};

export default MyAnnotationsEntityCollection;
