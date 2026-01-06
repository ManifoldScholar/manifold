import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { resourceCollectionsAPI, ApiClient } from "api";
import cookie from "js-cookie";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow";
import ResourceCollectionEmpty from "frontend/components/resource-collection/Preview/Empty";

export default function ResourceSlideshowFetcher({
  resourceCollection,
  initialResources,
  initialMeta
}) {
  const [slideshowResources, setSlideshowResources] = useState(
    initialResources ?? []
  );
  const [slideshowMeta, setSlideshowMeta] = useState(initialMeta);
  const [loaded, setLoaded] = useState(!!initialResources);

  const loadResources = useCallback(
    async page => {
      try {
        setLoaded(false);
        const authToken = cookie.get("authToken");
        const client = new ApiClient(authToken, { denormalize: true });
        const result = await client.call(
          resourceCollectionsAPI.collectionResources(
            resourceCollection.id,
            {},
            { number: page, size: 20 }
          )
        );
        setSlideshowResources(result?.data ?? []);
        setSlideshowMeta(result?.meta ?? null);
        setLoaded(true);
      } catch (error) {
        console.error("Failed to load slideshow resources", error);
        setLoaded(true);
      }
    },
    [resourceCollection.id]
  );

  useEffect(() => {
    if (!initialResources) {
      loadResources(1);
    }
  }, [initialResources, loadResources]);

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
      setPageNumber={loadResources}
    />
  );
}

ResourceSlideshowFetcher.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  initialResources: PropTypes.array,
  initialMeta: PropTypes.object
};
