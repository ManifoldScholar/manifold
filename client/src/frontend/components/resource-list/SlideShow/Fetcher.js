import { resourceCollectionsAPI } from "api";
import { useFetch, usePaginationState } from "hooks";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow";
import ResourceCollectionEmpty from "frontend/components/resource-collection/Preview/Empty";

export default function ResourceSlideshowFetcher({
  resourceCollection,
  requestKey
}) {
  const [pagination, setPageNumber] = usePaginationState(1, 20);
  const { data: slideshowResources, meta: slideshowMeta, loaded } = useFetch({
    request: [
      resourceCollectionsAPI.collectionResources,
      resourceCollection.id,
      undefined,
      pagination
    ],
    options: { requestKey }
  });

  return !slideshowMeta?.pagination?.totalCount ? (
    <ResourceCollectionEmpty
      resourceCollection={resourceCollection}
      loading={!loaded}
    />
  ) : (
    <ResourceCollectionSlideshow
      resourceCollection={resourceCollection}
      collectionResources={slideshowResources}
      pagination={slideshowMeta?.pagination}
      setPageNumber={setPageNumber}
    />
  );
}
