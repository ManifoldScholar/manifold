import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const Link = styled.a`
  width: calc(50% - 7px);
  padding: 0.813em 0.8em;
  font-size: 12px;
  line-height: 13px;
  text-align: center;

  ${respond(
    `
    width: 180px;
    padding: 0.813em 1.438em;
    font-size: 14px;
    `,
    50
  )}

  ${respond(
    `
    display: flex;
    max-width: 100%;`,
    65
  )}
`;
