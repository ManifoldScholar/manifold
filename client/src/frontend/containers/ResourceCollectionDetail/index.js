import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { resourceCollectionsAPI, requests } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import { breadcrumbs } from "./breadcrumbs";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import EntityCollection from "frontend/components/entity/Collection";
import { useFetch, useListQueryParams, useListFilters } from "hooks";

export default function ResourceCollectionDetailContainer({
  project,
  journalBreadcrumbs,
}) {
  const { t } = useTranslation();

  const { resourceCollectionId } = useParams();
  const { data: collection } = useFetch({
    request: [resourceCollectionsAPI.show, resourceCollectionId],
    options: { requestKey: requests.feResourceCollection },
  });

  const { pagination, filters, setFilters } = useListQueryParams({
    scrollTargetId: "collection-list-header",
  });

  const { data: resources, meta } = useFetch({
    request: [
      resourceCollectionsAPI.collectionResources,
      resourceCollectionId,
      filters,
      pagination,
    ],
    options: { requestKey: requests.feCollectionResources },
  });
  const { data: slideshowResources, meta: slideshowMeta } = useFetch({
    request: [resourceCollectionsAPI.collectionResources, resourceCollectionId],
    options: { requestKey: requests.feSlideshow },
  });

  const filterProps = useListFilters({
    onFilterChange: (param) => setFilters(param),
    initialState: filters,
    resetState: { resource_collection: resourceCollectionId },
    options: {
      sort: true,
      kinds: collection?.attributes.resourceKinds,
      tags: collection?.attributes.resourceTags,
    },
  });

  const headContentProps = useEntityHeadContent(collection, project);

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
          t,
        })}
      />
      <EntityCollection.ProjectResourceCollectionDetail
        resourceCollection={collection}
        resources={resources ?? []}
        project={project}
        meta={meta}
        slideshowResources={slideshowResources}
        slideshowResourcesMeta={slideshowMeta}
        filterProps={filterProps}
      />
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
  t: PropTypes.func,
};

ResourceCollectionDetailContainer.displayName =
  "Frontend.Containers.ResourceCollectionDetail";
