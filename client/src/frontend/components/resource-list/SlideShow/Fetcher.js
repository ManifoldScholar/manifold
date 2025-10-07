import { resourceCollectionsAPI } from "api";
import { useFetch, usePaginationState } from "hooks";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow";

export default function ResourceSlideshowFetcher({
  resourceCollection,
  requestKey
}) {
  const [pagination, setPageNumber] = usePaginationState(1, 20);
  const { data: slideshowResources, meta: slideshowMeta } = useFetch({
    request: [
      resourceCollectionsAPI.collectionResources,
      resourceCollection.id,
      undefined,
      pagination
    ],
    options: { requestKey }
  });

  return (
    <ResourceCollectionSlideshow
      resourceCollection={resourceCollection}
      collectionResources={slideshowResources}
      pagination={slideshowMeta?.pagination}
      setPageNumber={setPageNumber}
    />
  );
}
