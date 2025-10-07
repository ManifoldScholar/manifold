import { useContext, useCallback } from "react";
import ResourcePreview from "frontend/components/resource/Preview";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow/Fetcher";
import { useFromStore } from "hooks";
import { ResourceMarkerContext } from "../Marker/context";
import * as Styled from "./styles";

export default function ResourceBlock({ annotation }) {
  const resource = useFromStore({
    action: "grab",
    entityType: "resources",
    id: annotation.resourceId,
    allowPartial: true
  });
  const resourceCollection = useFromStore({
    action: "grab",
    entityType: "resourceCollections",
    id: annotation.resourceCollectionId,
    allowPartial: true
  });

  const { destroyAnnotation } = useContext(ResourceMarkerContext);

  const handleDestroy = useCallback(() => {
    destroyAnnotation({ id: annotation.id, type: "annotations" });
  }, [annotation.id, destroyAnnotation]);

  if (resourceCollection)
    return (
      <Styled.Block data-annotation-resource-unselectable>
        <ResourceCollectionSlideshow
          resourceCollection={resourceCollection}
          fetchKey={`reader-collection-slideshow-${resourceCollection.id}`}
        />
      </Styled.Block>
    );

  return resource ? (
    <Styled.Block data-annotation-resource-unselectable>
      <ResourcePreview
        resource={resource}
        textId={annotation?.textId}
        destroyAnnotation={handleDestroy}
      />
    </Styled.Block>
  ) : null;
}
