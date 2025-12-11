import { useState } from "react";
import PropTypes from "prop-types";
import { resourceCollectionsAPI } from "api";
import { useFetch } from "hooks";
import ResourceCollectionSlideshow from "components/frontend/resource-list/SlideShow";
import ResourceCollectionEmpty from "components/frontend/resource-collection/Preview/Empty";

export default function ResourceSlideshowFetcher({
  resourceCollection,
  initialResources,
  initialMeta
}) {
  const [page, setPage] = useState(initialResources ? null : 1);

  const { data, meta: fetchedMeta, loaded } = useFetch(
    () =>
      resourceCollectionsAPI.collectionResources(
        resourceCollection.id,
        {},
        { number: page ?? 1, size: 20 }
      ),
    [resourceCollection.id, page],
    { condition: page !== null }
  );

  const resources = data ?? initialResources ?? [];
  const meta = fetchedMeta ?? initialMeta;
  const isLoaded = page === null ? true : loaded;

  return !meta?.pagination?.totalCount ? (
    <ResourceCollectionEmpty
      resourceCollection={resourceCollection}
      loading={!isLoaded}
    />
  ) : (
    <ResourceCollectionSlideshow
      resourceCollection={resourceCollection}
      collectionResources={resources}
      pagination={meta?.pagination}
      setPageNumber={setPage}
    />
  );
}

ResourceSlideshowFetcher.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  initialResources: PropTypes.array,
  initialMeta: PropTypes.object
};
