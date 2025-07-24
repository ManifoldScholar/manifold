import * as Styled from "./styles";

export default function ResourceBlock({ annotation }) {
  return (
    <Styled.Block>
      <p>Resource block for:</p>
      <p>{annotation.resourceId}</p>
    </Styled.Block>
  );
}
