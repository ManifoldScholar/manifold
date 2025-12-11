import styled from "@emotion/styled";
import { respond, headingPrimary, fluidScale } from "theme/styles/mixins";

export const Wrapper = styled.div`
  margin: auto;
  padding-block-end: 54px;

  ${respond(`width: 600px;`, 75)}
`;

export const Header = styled.h1`
  ${headingPrimary}
  margin-bottom: 10px;
`;

export const Body = styled.div`
  font-family: var(--font-family-copy);
  font-size: ${fluidScale("18px", "16px")};
  line-height: 1.5;

  h1,
  h2,
  h3 {
    ${headingPrimary}
    display: block;
  }

  h1,
  h2 {
    margin-block-start: 40px;
    margin-block-end: 10px;
  }

  h2 {
    font-size: ${fluidScale("21px", "18px")};
  }

  h3 {
    font-size: ${fluidScale("18px", "16px")};
    margin-block: 10px;
  }

  h4 {
    line-height: 1.5;
  }
`;
