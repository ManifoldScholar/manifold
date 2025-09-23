import ResourcePreview from "frontend/components/resource/Preview";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function ResourceBlock({ annotation }) {
  const resource = useFromStore(
    `entityStore.entities.resources["${annotation.resourceId}"]`
  );
  const resourceCollection = useFromStore(
    `entityStore.entities.resourceCollections["${annotation.resourceCollectionId}"]`
  );

  if (resourceCollection)
    return (
      <Styled.Block data-annotation-resource-unselectable>
        <p>WIP Resource collection annotation</p>
        {/* // TODO wire up resource collection slideshow
        <ResourceCollectionSlideshow
          resourceCollection={resourceCollection}
          collectionResources={resourceCollection.relationships.resources}
          pagination={slideshowResourcesMeta.pagination}
          dispatch={dispatch}
        /> */}
      </Styled.Block>
    );

  return resource ? (
    <Styled.Block data-annotation-resource-unselectable>
      <ResourcePreview resource={resource} />
    </Styled.Block>
  ) : null;
}
