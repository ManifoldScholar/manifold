import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  ${buttonUnstyled}
  ${utilityPrimary}
  display: inline-flex;
  border: 1px solid;
  border-radius: 16px;
  color: var(--color-accent-primary);
  width: 100%;

  ${respond(`width: auto;`, 60)};
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-inline: ${({ $padding }) => $padding};
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  text-transform: none;
  letter-spacing: 0;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};
  width: 50%;

  ${respond(`width: auto;`, 60)}

  ${({ $active }) =>
    $active
      ? `
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--hover-color);
      border-color: var(--hover-color);

      &:hover {
        color: var(--color-neutral-text-extra-dark);
      }

      &:focus-visible {
        color: var(--color-base-neutral100);
        background-color: var(--color-accent-primary-pale);
        border-color: var(--color-accent-primary-pale);
        outline: 0;
      }`
      : `
      &:focus-visible {
        color: var(--color-base-neutral100);
        background-color: var(--color-accent-primary-pale);
        border-color: var(--color-accent-primary-pale);
        outline: 0;
      }

      &:hover {
        color: inherit;
        background-color: inherit;
        border-color: inherit;
      }
      `}

  span {
    padding-top: 7px;
    padding-bottom: 9px;
  }

  svg {
    width: 24px;
    height: 24px;
    padding-bottom: 2px;
    margin: 0;
  }

  * + & {
    border-left: 1px solid;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
  }
`;

export const MobileLabel = styled.span`
  ${respond(`display: none;`, 40)};
`;

export const Label = styled.span`
  ${MobileLabel} + & {
    display: none;

    ${respond(`display: inline;`, 40)};
  }
`;
