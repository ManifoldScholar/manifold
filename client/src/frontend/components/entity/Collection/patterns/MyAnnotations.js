import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Annotation from "global/components/Annotation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
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
  const { t } = useTranslation();

  if (!annotations || !annotationsMeta) return null;

  const hasAnnotations = annotations.length > 0;

  return (
    <EntityCollection
      title={t("pages.my_notes")}
      icon="NotesUnique"
      filterProps={hasAnnotations ? filterProps : null}
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
  "Frontend.Entity.Collection.MyAnnotations";

MyAnnotationsEntityCollection.propTypes = {
  annotations: PropTypes.array,
  annotationsMeta: PropTypes.object,
  annotatedTexts: PropTypes.array,
  filterProps: PropTypes.object,
  isFiltered: PropTypes.bool,
  paginationProps: PropTypes.object
};

export default MyAnnotationsEntityCollection;
