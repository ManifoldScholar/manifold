import styled from "@emotion/styled";
import { formInstructions, respond } from "theme/styles/mixins";

// There are still a number of classnames to disentangle in here.

export const PrimaryInstructions = styled.span`
  ${formInstructions}
  display: block;
  margin-block-end: 1em;

  a:visited {
    color: inherit;
  }

  &:last-child {
    margin-block-end: 0;
  }

  &.space-bottom {
    margin-block-end: 2em;
  }

  ${({ $withActions }) =>
    $withActions &&
    `grid-column: 1 / -1;
    margin-bottom: 1em !important;

    ${respond(`margin-bottom: 0 !important;`, 60)}
  `}
`;

export const SecondaryInstructions = styled(PrimaryInstructions)`
  margin-block-start: 0.5em;

  &.inline {
    display: inline;
  }

  a {
    color: inherit;
  }
`;
