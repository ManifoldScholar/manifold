import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { resourceCollectionsAPI } from "api";
import { useApiCallback } from "hooks";
import Utility from "components/global/utility";
import AnnotationList from "components/global/Annotation/List/Default";
import * as Styled from "./styles";

export default function ResourceCollectionAnnotations({
  collection,
  initialAnnotations,
  initialAnnotationsMeta
}) {
  const { t } = useTranslation();
  const [annotations, setAnnotations] = useState(initialAnnotations ?? []);
  const [annotationsMeta, setAnnotationsMeta] = useState(
    initialAnnotationsMeta
  );

  const fetchAnnotations = useApiCallback(resourceCollectionsAPI.annotations);

  const loadPage = async page => {
    try {
      const result = await fetchAnnotations(collection.id, undefined, {
        number: page,
        size: 5
      });
      setAnnotations(prev => [...prev, ...(result?.data ?? [])]);
      setAnnotationsMeta(result?.meta ?? null);
    } catch (error) {
      console.error("Failed to load annotations", error);
    }
  };

  useEffect(() => {
    if (!initialAnnotations) loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAnnotations]);

  const afterDelete = id =>
    setAnnotations(annotations.filter(a => a.id !== id));

  const remainingAnnotations =
    annotationsMeta?.pagination?.totalCount -
    5 * annotationsMeta?.pagination?.currentPage;
  const nextAnnotationsCount =
    remainingAnnotations > 5 ? 5 : remainingAnnotations;

  return (
    <Styled.Annotations>
      <Styled.AnnotationsHeader>
        {t("glossary.annotation_title_case_other")}
      </Styled.AnnotationsHeader>
      {annotations?.length ? (
        <>
          <AnnotationList
            annotations={annotations}
            onDelete={afterDelete}
            compact
          />
          {!!annotationsMeta?.pagination?.nextPage && (
            <button
              className="comment-more"
              onClick={() => loadPage(annotationsMeta?.pagination?.nextPage)}
            >
              {t("actions.see_next_annotation", {
                count: nextAnnotationsCount
              })}
              <Utility.IconComposer
                icon="disclosureDown16"
                size={16}
                className="comment-more__icon"
              />
            </button>
          )}
        </>
      ) : (
        <Styled.EmptyMessage>
          {t("placeholders.resource_collection_annotations")}
        </Styled.EmptyMessage>
      )}
    </Styled.Annotations>
  );
}

ResourceCollectionAnnotations.displayName = "ResourceCollection.Annotations";

ResourceCollectionAnnotations.propTypes = {
  collection: PropTypes.object.isRequired,
  initialAnnotations: PropTypes.array,
  initialAnnotationsMeta: PropTypes.object
};
