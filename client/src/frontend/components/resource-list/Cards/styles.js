import styled from "@emotion/styled";
import { listUnstyled, respond } from "theme/styles/mixins";

export const List = styled.ul`
  --column-gap: 30px;

  ${listUnstyled}
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--column-gap);
  row-gap: 18px;

  ${respond(`--column-gap: 4.858vw;`, 85)}

  ${respond(`grid-template-columns: repeat(2, 1fr);`, 75)}
`;
