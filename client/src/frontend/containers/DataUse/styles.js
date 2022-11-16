import styled from "@emotion/styled";
import { respond, formLabelPrimary, headingPrimary } from "theme/styles/mixins";

export const Wrapper = styled.div`
  width: 100%;

  ${respond(`width: 70%;`, 82)}
`;

export const Header = styled.h1`
  ${headingPrimary}
  margin-bottom: 25px;
`;

export const Body = styled.div`
  font-family: var(--font-family-copy);

  h1 {
    ${headingPrimary}
    margin-bottom: 25px;
  }

  h2,
  h3 {
    ${formLabelPrimary}
    display: block;
    font-size: 14px;
    margin-block: 25px;
  }

  h2 {
    font-size: 16px;
  }
`;
