import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import {
  respond,
  listUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";
import NavigationLink from "../NavigationLink/index";

export const Nav = styled("nav", transientOptions)`
  ${({ $mobile }) =>
    $mobile
      ? respond(`display: none;`, 85)
      : `
        display: none;
        ${respond(`display: block;`, 85)}
  `}

  margin-top: -20px;
  margin-bottom: 20px;
  ${listUnstyled}
  font-size: 16px;

  ${respond(`margin-bottom: 0;`, 75)}
`;

export const List = styled.ul`
  ${listUnstyled}
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  ${respond(
    `
      gap: 90px;
    `,
    90
  )}

  > * {
    flex-grow: 1;
  }
`;

export const Group = styled.ul`
  ${listUnstyled}
  max-width: 150px;
  display: flex;
  flex-direction: column;
  gap: 0.8em;

  ${respond(
    `
      max-width: 160px;
    `,
    90
  )}
`;

export const Item = styled.li`
  display: flex;
  font-size: 17px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
`;

export const Link = styled(NavigationLink)`
  text-decoration: none;
  cursor: pointer;

  &:hover {
    > * {
      color: var(--color-interaction-light);
    }
  }

  > * {
    color: var(--color-base-neutral-white);
    transition: color ${defaultTransitionProps};
  }

  > svg {
    position: relative;
    top: -1px;
    margin-right: 14px;
    color: var(--color);
  }
`;
