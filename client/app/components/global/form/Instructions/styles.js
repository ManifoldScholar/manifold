import styled from "@emotion/styled";
import { formInstructions, respond } from "theme/styles/mixins";

// There are still a number of classnames to disentangle in here.

export const PrimaryInstructions = styled.span`
  ${formInstructions}
  display: block;

  a:visited {
    color: inherit;
  }

  &:not(:first-child) {
    margin-block-start: var(--Instructions-margin-block-start);
  }

  &:not(:last-child) {
    margin-block-end: var(--Instructions-margin-block-end, 1em);

    &.space-bottom {
      --Instructions-margin-block-end: 2em;
    }
  }

  ${({ $withActions }) =>
    $withActions &&
    `
      --Instructions-margin-block-end: 1em;
      grid-column: 1 / -1;

      ${respond(`--Instructions-margin-block-end: 0;`, 60)}
  `}
`;

export const SecondaryInstructions = styled(PrimaryInstructions)`
  &:not(:first-child) {
    margin-block-start: var(--Instructions-margin-block-start, 0.5em);
  }

  &.inline {
    display: inline;
  }

  a {
    color: inherit;
  }
`;
