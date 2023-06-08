import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import {
  listUnstyled,
  defaultTransitionProps,
  defaultFocusStyle,
  buttonUnstyled
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  padding: 18px 24px 18px 20px;
  border-radius: 8px;
  background-color: var(--color-base-neutral100);
  border: 1px solid var(--color-base-neutral90);
  box-shadow: 0px 12px 32px 3px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 60px;
  left: 150px;
  z-index: 1;

  ${({ $visible }) =>
    $visible
      ? `
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        transition:
          opacity ${defaultTransitionProps},
          transform ${defaultTransitionProps};
      `
      : `
        opacity: 0;
        visibility: hidden;
        transform: translateY(${-20}px);
        transition:
          opacity ${defaultTransitionProps},
          transform ${defaultTransitionProps},
          visibility 0s var(--transition-duration-default);
    `}
`;

export const List = styled.ul`
  ${listUnstyled}
  whitespace: nowrap;
  display: flex;
  flex-direction: column;

  > * + * {
    margin-block-start: 16px;
  }
`;

export const Link = styled(NavLink)`
  display: flex !important;
  gap: 10px;
  align-items: center;
  text-decoration: none;
`;

export const LinkIcon = styled(IconComposer)``;

export const LinkText = styled.span`
  font-family: var(--font-family-sans);
  position: relative;
  font-size: 16px;
  text-decoration: none;
  color: var(--color-base-neutral20);
`;

export const Button = styled.button`
  ${buttonUnstyled}

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const ButtonText = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;

  ${({ $active }) => $active && `color: var(--color-base-neutral-white);`}

  & svg {
    margin-top: 4px;
  }
`;
