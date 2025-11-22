import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFetch, usePaginationState } from "hooks";
import { resourcesAPI } from "api";
import Utility from "global/components/utility";
import AnnotationList from "global/components/Annotation/List/Default";
import { entityStoreActions } from "actions";
import * as Styled from "./styles";

const { flush } = entityStoreActions;

const ANNOTATION_FILTERS = { orphaned: false };

function ResourceDetailAnnotations() {
  const { t } = useTranslation();

  const { resourceId } = useParams();

  const [annotationsPagination, setAnnotationsPage] = usePaginationState(1, 5);

  const {
    data: annotations,
    meta: annotationsMeta,
    refresh: refreshAnnotations
  } = useFetch({
    request: [
      resourcesAPI.annotations,
      resourceId,
      ANNOTATION_FILTERS,
      annotationsPagination
    ],
    options: {
      requestKey: "RESOURCE_DETAIL_ANNOTATIONS",
      appends: "RESOURCE_DETAIL_ANNOTATIONS"
    },
    dependencies: [resourceId]
  });

  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(flush("RESOURCE_DETAIL_ANNOTATIONS"));
  }, [dispatch]);

  const remainingAnnotations =
    annotationsMeta?.pagination?.totalCount -
    5 * annotationsMeta?.pagination?.currentPage;
  const nextAnnotationsCount =
    remainingAnnotations > 5 ? 5 : remainingAnnotations;

  return annotations?.length ? (
    <>
      <AnnotationList
        annotations={annotations}
        refresh={refreshAnnotations}
        compact
      />
      {!!annotationsMeta?.pagination?.nextPage && (
        <button
          className="comment-more"
          onClick={() =>
            setAnnotationsPage(annotationsMeta?.pagination?.nextPage)
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
      {t("placeholders.resource_annotations")}
    </Styled.EmptyMessage>
  );
}

ResourceDetailAnnotations.displayName = "Resource.Detail.Annotations";

export default ResourceDetailAnnotations;
