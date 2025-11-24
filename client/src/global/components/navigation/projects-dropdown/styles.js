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
  --_Wrapper-bg-color: var(--color-header-background);
  --_Wrapper-border-color: var(--color-base-neutral20);

  .backend & {
    --_Wrapper-bg-color: var(--color-base-neutral100);
    --_Wrapper-border-color: var(--color-base-neutral90);
  }

  padding: 18px 24px 18px 20px;
  border-radius: 8px;
  background-color: var(--_Wrapper-bg-color);
  border: 1px solid var(--_Wrapper-border-color);
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

export const LinkText = styled.span`
  --_LinkText-color: inherit;

  .backend & {
    --_LinkText-color: var(--color-base-neutral-white);
  }

  font-family: var(--font-family-sans);
  position: relative;
  font-size: 16px;
  text-decoration: none;
  color: var(--_LinkText-color);
`;

export const Link = styled(NavLink)`
  display: flex !important;
  gap: 10px;
  align-items: center;
  text-decoration: none;

  &.active ${LinkText} {
    color: var(--color-neutral-text-extra-light);
  }
`;

export const LinkIcon = styled(IconComposer)``;

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

  body:not(.backend) & {
    ${({ $active }) =>
      $active && `color: var(--color-header-foreground-active);`}

    span {
      display: inline-block;
      position: relative;

      &::before {
        ${({ $active }) =>
          $active &&
          ` {
          position: absolute;
          bottom: -5.25px;
          left: 0;
          width: 100%;
          display: block;
          height: 1.5px;
          content: "";
          background-color: currentColor;

          .site-nav--backend & {
            display: none;
          }`}
      }
    }
  }
`;
