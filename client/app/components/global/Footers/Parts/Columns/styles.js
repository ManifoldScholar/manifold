import styled from "@emotion/styled";
import { respond, fluidScale } from "theme/styles/mixins";

export const Columns = styled.div`
  & + & {
    margin-block-start: ${fluidScale("70px", "30px")};
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column-reverse;

  ${respond(
    `
      flex-direction: row;
      justify-content: space-between;
    `,
    65
  )}
`;
