import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Annotation from "global/components/Annotation";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "../EntityCollection";

function GroupAnnotationsEntityCollection({
  readingGroup,
  annotations,
  annotationsMeta,
  filterProps,
  isFiltered,
  paginationProps,
  ...passThroughProps
}) {
  if (!readingGroup || !annotations || !annotationsMeta) return null;

  const hasAnnotations = annotations.length > 0;

  return (
    <EntityCollection
      filterProps={
        isEmpty(annotationsMeta) || isEmpty(filterProps) ? null : filterProps
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
            <EntityCollectionPlaceholder.GroupAnnotations
              readingGroup={readingGroup}
            />
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

GroupAnnotationsEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.GroupAnnotations";

GroupAnnotationsEntityCollection.propTypes = {
  readingGroup: PropTypes.object,
  annotations: PropTypes.array,
  annotationsMeta: PropTypes.object,
  filterProps: PropTypes.object,
  isFiltered: PropTypes.bool,
  paginationProps: PropTypes.object
};

export default GroupAnnotationsEntityCollection;
