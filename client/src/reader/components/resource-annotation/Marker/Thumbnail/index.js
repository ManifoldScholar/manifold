import * as Styled from "../styles";

export default function Thumbnail({ id, grouped }) {
  return <Styled.Inner $grouped={grouped}>{id.slice(0, 5)}</Styled.Inner>;
}
