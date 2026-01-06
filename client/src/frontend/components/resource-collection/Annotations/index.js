import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { resourceCollectionsAPI } from "api";
import { ApiClient } from "api";
import cookie from "js-cookie";
import Utility from "global/components/utility";
import AnnotationList from "global/components/Annotation/List/Default";
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

  const loadAnnotations = useCallback(
    async page => {
      try {
        const authToken = cookie.get("authToken");
        const client = new ApiClient(authToken, { denormalize: true });
        const result = await client.call(
          resourceCollectionsAPI.annotations(collection.id, undefined, {
            number: page,
            size: 5
          })
        );
        setAnnotations(prev => [...prev, ...(result ?? [])]);
        setAnnotationsMeta(result?.meta ?? null);
      } catch (error) {
        console.error("Failed to load annotations", error);
      }
    },
    [collection.id]
  );

  useEffect(() => {
    if (!initialAnnotations) loadAnnotations(1);
  }, [initialAnnotations, loadAnnotations]);

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
            refresh={afterDelete}
            compact
          />
          {!!annotationsMeta?.pagination?.nextPage && (
            <button
              className="comment-more"
              onClick={() =>
                loadAnnotations(annotationsMeta?.pagination?.nextPage)
              }
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
