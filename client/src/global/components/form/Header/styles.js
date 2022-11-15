import styled from "@emotion/styled";
import {
  roundedFormHeader,
  respond,
  headingPrimary
} from "theme/styles/mixins";

export const Header = styled.header`
  ${roundedFormHeader}

  ${respond(`margin-bottom: 38px;`, 90)}
`;

export const HeaderPrimary = styled.header`
  margin-block-end: 25px;

  > h2 {
    ${headingPrimary}
    margin-block-end: 0;
  }
`;
