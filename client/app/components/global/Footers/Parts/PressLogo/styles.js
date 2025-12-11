import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const Link = styled.a`
  display: none;
  padding: 0;
  margin-bottom: 14px;

  ${respond(
    `
      display: inline-block;
      float: right;
      margin-bottom: 0;
    `,
    65
  )}
`;

export const Image = styled.img`
  max-width: 328px;
  max-height: 202px;
`;
