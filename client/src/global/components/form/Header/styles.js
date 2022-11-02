import styled from "@emotion/styled";
import {
  roundedFormHeader,
  respond,
  headingPrimary
} from "theme/styles/mixins";

export const Header = styled.header`
  ${roundedFormHeader}
  ${respond(`margin-bottom: 38px;`, 90)}

  ${({ $hasInstructions }) =>
    $hasInstructions &&
    `
    margin-bottom: 0 !important;

    > * {
      display: block;
    }

    > span {
      color: var(--color-neutral-ui-light);
      font-family: var(--font-family-copy);
      text-transform: none;
      font-size: 16px;
      padding-block-end: 14px;
    }
  `}

`;

export const HeaderPrimary = styled.header`
  margin-block-end: 25px;

  > h2 {
    ${headingPrimary}
    margin-block-end: 0;
  }
`;
