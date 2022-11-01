import styled from "@emotion/styled";
import {
  roundedFormHeader,
  respond,
  headingPrimary
} from "theme/styles/mixins";

export const Header = styled.header`
  ${roundedFormHeader}

  ${({ $hasInstructions }) =>
    $hasInstructions &&
    `
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



  ${respond(`margin-bottom: 38px;`, 90)}
`;

export const HeaderPrimary = styled.header`
  margin-block-end: 25px;

  .subscriptions & {
    margin-block-end: 55px;
  }

  > h2 {
    ${headingPrimary}

    &:not(:last-child) {
      margin-block-end: 0;
    }
  }
`;
