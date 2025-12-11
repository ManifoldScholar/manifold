import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const CalloutsContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${respond(
    `
      flex-flow: row nowrap;
      gap: 12px;

      > * {
        flex-basis: calc(25%);
      }
    `,
    85
  )}
`;
