import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function ResourceBlock({ annotation }) {
  const resource = useFromStore(
    `entityStore.entities.resources["${annotation.resourceId}"]`
  );
  return (
    <Styled.Block>
      <p>Resource block for:</p>
      <p>{resource?.attributes.title}</p>
      {annotation.readerDisplayFormat === "embed" ? (
        <p>Display: Interactive embed</p>
      ) : (
        <p>Display: Static callout</p>
      )}
    </Styled.Block>
  );
}
