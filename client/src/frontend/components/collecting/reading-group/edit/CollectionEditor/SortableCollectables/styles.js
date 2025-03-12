import styled from "@emotion/styled";
import { listUnstyled } from "theme/styles/mixins";

const collectableMinHeight = `50px`;
const collectableVerticalPadding = `5px`;

export const List = styled.ul`
  ${listUnstyled}
  position: relative;
  min-height: calc(${collectableMinHeight} + ${collectableVerticalPadding} * 2);
  margin-block-start: -${collectableVerticalPadding};
  margin-block-end: -${collectableVerticalPadding};
`;

export const Item = styled.li`
  ${({ $hidden }) => $hidden && `display: none;`}
`;
