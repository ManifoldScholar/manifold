import styled from "styled-components";
import { defaultFocusStyle, defaultTransitionProps } from "theme/styles/mixins";

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding-block-start: 2px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  line-height: 22px;
  color: var(--color-base-neutral90);

  > span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${defaultTransitionProps};
  }

  a:hover {
    color: var(--color-base-neutral90);
    text-decoration: underline;
  }

  a:focus-visible {
    ${defaultFocusStyle}
  }

  > span a {
    color: var(--color-base-neutral75);
  }

  span[aria-current="page"] {
    color: var(--color-base-neutral90);
  }
`;

export const Separator = styled.span`
  display: inline-flex;
  align-items: center;
  color: var(--color-base-neutral75);

  > svg {
    transform: rotate(-90deg);
  }
`;
