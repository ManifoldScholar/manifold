import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const ButtonGroup = styled.div`
  margin-block-end: 35px;
  margin-block-start: 20px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  row-gap: 12px;

  ${respond(
    `
    flex-direction: row;
    justify-content: start;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    `,
    40
  )}
`;

export const ButtonWithDisable = styled.button`
  &:disabled {
    cursor: default;
  }
`;
