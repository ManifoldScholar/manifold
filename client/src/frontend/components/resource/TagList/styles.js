import styled from "@emotion/styled";
import {
  listUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";
import { Link as LinkComponent } from "react-router-dom";

export const Container = styled("nav", transientOptions)`
  ${({ $isCard }) =>
    $isCard &&
    `
    padding-top: 18px;

    ${respond(`padding-top: 11px;`, 75)}
  `}
`;

export const List = styled.ul`
  ${listUnstyled}
`;

export const Tag = styled.li`
  ${utilityPrimary}
  display: inline;
  font-size: 13px;

  + li::before {
    content: ", ";
  }
`;

export const Link = styled(LinkComponent)`
  text-decoration: none;
  transition: color ${defaultTransitionProps};

  &.disabled {
    pointer-events: none;
  }

  &:not(.disabled):hover {
    color: var(--color-accent-primary);
  }
`;
