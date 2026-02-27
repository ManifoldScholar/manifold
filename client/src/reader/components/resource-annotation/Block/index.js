import { useContext, useCallback } from "react";
import ResourcePreview from "frontend/components/resource/Preview";
import ResourceCollectionPreview from "frontend/components/resource-collection/Preview";
import { ResourceMarkerContext } from "../Marker/context";
import useLoaderCollection from "hooks/useLoaderCollection";
import * as Styled from "./styles";

export default function ResourceBlock({ annotation }) {
  const { destroyAnnotation } = useContext(ResourceMarkerContext);

  const resources = useLoaderCollection("resources");
  const resourceCollections = useLoaderCollection("resource_collections");

  const resource = resources.find(r => r.id === annotation.resourceId);
  const resourceCollection = resourceCollections.find(
    c => c.id === annotation.resourceCollectionId
  );

  const handleDestroy = useCallback(() => {
    destroyAnnotation({ id: annotation.id, type: "annotations" });
  }, [annotation.id, destroyAnnotation]);

  if (resourceCollection)
    return (
      <Styled.Block data-annotation-resource-unselectable>
        <ResourceCollectionPreview
          resourceCollection={resourceCollection}
          textId={annotation?.textId}
          destroyAnnotation={handleDestroy}
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
