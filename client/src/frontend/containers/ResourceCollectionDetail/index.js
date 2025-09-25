import { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resourceCollectionsAPI, requests } from "api";
import { entityStoreActions as store } from "actions";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import { breadcrumbs } from "./breadcrumbs";
import Utility from "global/components/utility";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import EntityCollection from "frontend/components/entity/Collection";
import AnnotationList from "global/components/Annotation/List/Default";
import {
  useFetch,
  useListQueryParams,
  useListFilters,
  usePaginationState
} from "hooks";
import config from "config";
import * as Styled from "./styles";

export default function ResourceCollectionDetailContainer({
  project,
  journalBreadcrumbs
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { resourceCollectionId } = useParams();
  const { data: collection } = useFetch({
    request: [resourceCollectionsAPI.show, resourceCollectionId],
    options: { requestKey: requests.feResourceCollection }
  });

  const { pagination, filters, setFilters } = useListQueryParams({
    scrollTargetId: "collection-list-header"
  });

  const { data: resources, meta } = useFetch({
    request: [
      resourceCollectionsAPI.collectionResources,
      resourceCollectionId,
      filters,
      pagination
    ],
    options: { requestKey: requests.feCollectionResources }
  });

  const [annotationsPagination, setAnnotationsPage] = usePaginationState(1, 5);

  const {
    data: annotations,
    meta: annotationsMeta,
    refresh: refreshAnnotations
  } = useFetch({
    request: [
      resourceCollectionsAPI.annotations,
      resourceCollectionId,
      undefined,
      annotationsPagination
    ],
    options: {
      requestKey: "RESOURCE_COLLECTION_DETAIL_ANNOTATIONS",
      appends: "RESOURCE_COLLECTION_DETAIL_ANNOTATIONS"
    },
    dependencies: [resourceCollectionId],
    condition: !config.environment.isServer
  });
  /* Fetch these in the client only, so we don't end up with duplicates when navigating between collection resources using back/fwd. */

  useEffect(() => {
    return () => {
      dispatch(store.flush("RESOURCE_COLLECTION_DETAIL_ANNOTATIONS"));
    };
  }, [dispatch]);

  const filterProps = useListFilters({
    onFilterChange: param => setFilters(param),
    initialState: filters,
    resetState: { resource_collection: resourceCollectionId },
    options: {
      sort: true,
      kinds: collection?.attributes.resourceKinds,
      tags: collection?.attributes.resourceTags
    }
  });

  const headContentProps = useEntityHeadContent(collection, project);

  const remainingAnnotations =
    annotationsMeta?.pagination?.totalCount -
    5 * annotationsMeta?.pagination?.currentPage;
  const nextAnnotationsCount =
    remainingAnnotations > 5 ? 5 : remainingAnnotations;

  if (!project || !collection) return null;

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={collection} />
      <CheckFrontendMode
        debugLabel="ResourceCollectionDetail"
        isProjectSubpage
      />
      <HeadContent {...headContentProps} />
      <RegisterBreadcrumbs
        breadcrumbs={breadcrumbs({
          project,
          collection,
          journalBreadcrumbs,
          t
        })}
      />
      <EntityCollection.ProjectResourceCollectionDetail
        resourceCollection={collection}
        resources={resources ?? []}
        project={project}
        meta={meta}
        filterProps={filterProps}
      />
      <Styled.Annotations>
        <Styled.AnnotationsHeader>
          {t("glossary.annotation_title_case_other")}
        </Styled.AnnotationsHeader>
        {annotations?.length ? (
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
            {t("placeholders.resource_collection_annotations")}
          </Styled.EmptyMessage>
        )}
      </Styled.Annotations>
    </>
  );
}

ResourceCollectionDetailContainer.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  slideshowResources: PropTypes.array,
  slideshowResourcesMeta: PropTypes.object,
  project: PropTypes.object,
  resourceCollection: PropTypes.object,
  resources: PropTypes.array,
  resourcesMeta: PropTypes.object,
  history: PropTypes.object,
  journalBreadcrumbs: PropTypes.array,
  t: PropTypes.func
};

ResourceCollectionDetailContainer.displayName =
  "Frontend.Containers.ResourceCollectionDetail";
