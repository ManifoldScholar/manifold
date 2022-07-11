import styled from "@emotion/styled";
import { listUnstyled, respond } from "theme/styles/mixins";

export const List = styled.ul`
  --column-gap: 30px;

  ${listUnstyled}
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--column-gap);
  row-gap: 18px;

  ${respond(`--column-gap: 4.858vw;`, 85)}
`;

export const Item = styled.li`
  flex-basis: 100%;

  ${respond(
    `
      flex-grow: 1;
      flex-basis: calc(50% - var(--column-gap));
    `,
    75
  )}
`;
