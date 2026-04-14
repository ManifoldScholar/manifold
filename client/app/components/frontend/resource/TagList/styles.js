import styled from "@emotion/styled";
import {
  listUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Container = styled("nav", transientOptions)`
  ${({ $isCard }) =>
    $isCard &&
    `
    padding-top: 18px;

    ${respond(`padding-top: 11px;`, 75)}
  `}
`;

export const GroupLabel = styled.span`
  ${utilityPrimary}
  font-size: 13px;
  color: var(--color);

  &::after {
    display: inline;
    content: ": ";
  }
`;

export const List = styled.ul`
  ${listUnstyled}
  max-width: 100%;
`;

export const Tag = styled.li`
  ${utilityPrimary}
  display: inline;
  font-size: 13px;

  + li::before {
    content: ", ";
  }
`;

export const Label = styled.span`
  text-decoration: none;
  transition: color ${defaultTransitionProps};
  color: var(--color-neutral-text-extra-dark);

  &.disabled {
    pointer-events: none;
  }

  &:not(.disabled):hover {
    color: var(--color-accent-primary);
  }
`;
