import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Annotation from "global/components/Annotation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "../EntityCollection";

function GroupAnnotationsEntityCollection({
  readingGroup,
  annotations,
  annotationsMeta,
  filterProps,
  isFiltered,
  paginationProps,
  refresh,
  ...passThroughProps
}) {
  const { t } = useTranslation();

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
              unit: t("glossary.note", {
                count: annotationsMeta?.pagination?.totalCount || 0
              })
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
            <EntityCollectionPlaceholder.FilteredAnnotations
              style={{ paddingBlockStart: "40px" }}
            />
          )}
          {!hasAnnotations && !isFiltered && (
            <EntityCollectionPlaceholder.GroupAnnotations
              readingGroup={readingGroup}
              refresh={refresh}
              style={{ paddingBlockStart: "40px" }}
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
  "Frontend.Entity.Collection.GroupAnnotations";

GroupAnnotationsEntityCollection.propTypes = {
  readingGroup: PropTypes.object,
  annotations: PropTypes.array,
  annotationsMeta: PropTypes.object,
  filterProps: PropTypes.object,
  isFiltered: PropTypes.bool,
  paginationProps: PropTypes.object
};

export default GroupAnnotationsEntityCollection;
