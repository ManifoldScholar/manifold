import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { respond } from "theme/styles/mixins";

export const Section = styled("section", transientOptions)`
  position: relative;
  padding-block-start: ${({ $standalone }) => ($standalone ? "0" : "8px")};
  font-size: 14px;
  font-family: var(--font-family-sans);

  ${({ $withTopMargin }) =>
    $withTopMargin &&
    `
      margin-top: 30px;
      ${respond(`padding-top: 67px;`, 65)}
    `}

  a {
    color: inherit;
  }
`;
