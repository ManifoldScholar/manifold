import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import {
  buttonUnstyled,
  defaultTransitionProps,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Item = styled.li`
  font-size: 16px;
  font-family: var(--font-family-sans);
`;

export const Link = styled.a`
  ${buttonUnstyled}
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 20px;
  text-decoration: none;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover,
  &.focus-visible {
    color: var(--color-base-neutral90);
    background-color: var(--color-base-neutral20);
    outline: 0;
  }

  &.focus-visible {
    ${defaultFocusStyle}
    outline-offset: -2px;
  }
`;

export const Icon = styled(IconComposer)`
  position: relative;
  top: 2px;
  margin-right: 10px;
  color: var(--UserMenuBody-Icon-color);
  transition: color ${defaultTransitionProps};

  ${Link}:hover &,
  ${Link}.focus-visible & {
    color: var(--color-base-neutral90);
  }
`;
