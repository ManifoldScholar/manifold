import styled from "@emotion/styled";
import {
  listUnstyled,
  buttonUnstyled,
  defaultHoverStyle,
  defaultTransitionProps
} from "theme/styles/mixins";
import { NavLink } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

export const Nav = styled.nav`
  font-family: var(--font-family-sans);
  position: relative;
  font-weight: var(--font-weight-semibold);
  text-align: center;
  text-transform: none;
  background-color: var(--color-base-neutral100);
  z-index: 50;
`;

export const Active = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 0 11px;

  ${({ $open }) => $open && `background: var(--color-base-neutral100);`}
`;

export const Disclosure = styled.button`
  ${buttonUnstyled}
  width: 100%;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 0;
  }

  ${({ $open }) => $open && defaultHoverStyle}
`;

export const Icon = styled(IconComposer)`
  margin-top: 3px;
  margin-left: 10px;
  transition: transform ${defaultTransitionProps};

  ${({ $open }) => $open && `transform: rotate(-180deg);`}
`;

export const List = styled.ul`
  ${listUnstyled}
  position: absolute;
  top: 105%;
  width: 100%;
  padding: 25px 43px 32px;
  text-align: center;
  visibility: hidden;
  background-color: var(--color-base-neutral100);
  border-top: 2px solid var(--color-base-neutral95);
  opacity: 0;
  transition: opacity var(--transition-duration-slow)
      var(--transition-timing-function),
    visibility var(--transition-duration-slow) var(--transition-timing-function);
  border-radius: 0 0 var(--box-border-radius) var(--box-border-radius);

  ${({ $open }) =>
    $open &&
    `visibility: visible;
      opacity: 1;
    `}
`;

export const Link = styled(NavLink)`
  display: inline-block;
  width: 100%;
  padding-top: 7px;
  padding-bottom: 7px;
  text-decoration: none;

  &.active {
    color: var(--color-neutral-text-extra-light);
  }
`;
