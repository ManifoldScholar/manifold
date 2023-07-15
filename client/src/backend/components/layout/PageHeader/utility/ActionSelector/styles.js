import styled from "@emotion/styled";
import {
  buttonUnstyled,
  formLabelPrimary,
  listUnstyled,
  defaultTransitionProps,
  respond,
  fluidScale
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";
import { NavLink } from "react-router-dom";
import { transientOptions } from "helpers/emotionHelpers";

export const Button = styled.button`
  ${buttonUnstyled}
  border-radius: var(--box-border-radius);
  background-color: var(--color-base-neutral100);
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 7px 12px 7px 16px;
  ${formLabelPrimary}
  font-size: 13px;
  font-size: ${fluidScale("13px", "12px")};

  &:hover,
  &:focus-visible {
    background-color: var(--color-accent-primary);
    color: var(--color-base-neutral100);
  }
`;

export const DropdownIcon = styled(IconComposer)``;

export const Positioner = styled.div`
  position: relative;
  width: max-content;

  ${respond(`display: none;`, 65)}
`;

export const Wrapper = styled.div`
  padding: 18px 28px 18px 20px;
  border-radius: 8px;
  background-color: var(--color-base-neutral100);
  border: 1px solid var(--color-base-neutral90);
  box-shadow: 0px 12px 32px 3px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 130%;
  left: 0;
  z-index: 51;

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
  width: max-content;
  max-width: 500px;
  min-width: 150px;

  > * + * {
    margin-block-start: 16px;
  }
`;

export const LinkText = styled.span`
  font-family: var(--font-family-sans);
  position: relative;
  font-size: 16px;
  text-decoration: none;
  color: var(--color-base-neutral20);

  &:only-child {
    margin-inline-start: 28px;
  }
`;

export const Link = styled(NavLink, transientOptions)`
  display: flex !important;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  whitespace: nowrap;
  ${buttonUnstyled}

  ${({ $noLink }) =>
    !$noLink &&
    `&:hover {
    ${LinkText} {
      color: var(--color-accent-primary);
    }
  }`}
`;

export const LinkIcon = styled(IconComposer)`
  color: inherit;
  margin-top: 2px;
`;
