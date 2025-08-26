import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function ResourceBlock({ annotation }) {
  const resource = useFromStore(
    `entityStore.entities.resources["${annotation.resourceId}"]`
  );
  const collection = useFromStore(
    `entityStore.entities.resourceCollections["${annotation.resourceCollectionId}"]`
  );
  const entity = resource ?? collection;

  return entity ? (
    <Styled.Block data-annotation-resource-unselectable>
      <p>Resource block for:</p>
      <p>{entity?.attributes.title}</p>
      {annotation.readerDisplayFormat === "embed" ? (
        <p>Display: Interactive embed</p>
      ) : (
        <p>Display: Static callout</p>
      )}
    </Styled.Block>
  ) : null;
}
