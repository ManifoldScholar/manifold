import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import {
  buttonUnstyled,
  defaultTransitionProps,
  utilityPrimary
} from "theme/styles/mixins";

export const Tab = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  flex-basis: ${({ $count }) => ($count ? `${100 / $count}%` : `50%`)};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--box-bg-color);
  padding: 10px 12px;
  white-space: nowrap;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    ${respond(
      `border-bottom-left-radius: 10px; border-top-right-radius: 0;`,
      60
    )}
  }

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    ${respond(
      `border-top-right-radius: 10px; border-bottom-left-radius: 0;`,
      60
    )}
  }

  &:hover {
    background-color: var(--color-accent-primary);
    color: var(--color-base-neutral90);
  }

  &:focus-visible {
    background-color: var(--color-accent-primary-pale);
    color: inherit;
    outline-offset: -2px;
  }

  ${({ $active }) =>
    $active &&
    `background-color: var(--color-base-neutral80); color: var(--color-base-neutral-white);`}
`;
