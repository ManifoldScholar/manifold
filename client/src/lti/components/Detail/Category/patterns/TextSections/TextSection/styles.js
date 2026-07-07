import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import {
  buttonUnstyled,
  defaultTransitionProps,
  listUnstyled
} from "theme/styles/mixins";

export const Row = styled("div", transientOptions)`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  padding-inline-start: 16px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--color-base-neutral90);
  transition: background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};

  ${({ $linkable }) =>
    $linkable &&
    `
        &:hover {
          background-color: var(--color-base-neutral05);
          border-color: var(--color-base-neutral40);
        }
        &:focus-within {
          outline: 2px solid var(--color-base-neutral90);
          background-color: var(--color-base-neutral-white);
          border-color: var(--color-base-neutral-white);
        }
      `}

  ${({ $selected }) =>
    $selected &&
    `
      background-color: var(--color-base-neutral05);
      border-color: var(--color-base-neutral40);
    `}
`;

export const Label = styled("span", transientOptions)`
  flex: 1 0 0;
  padding-inline-start: ${({ $depth }) => `${$depth * 24}px`};
`;

export const AddButton = styled("button", transientOptions)`
  ${buttonUnstyled}
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  font-size: 14px;
  line-height: 1.57;
  opacity: 0;
  pointer-events: none;
  background-color: transparent;
  border-radius: 0 5px 5px 0;
  transition: opacity ${defaultTransitionProps},
    background-color ${defaultTransitionProps}, color ${defaultTransitionProps};

  ${Row}:hover &,
  ${Row}:focus-within & {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background-color: var(--color-base-neutral90);
    color: var(--color-base-neutral-white);
    outline: 1px solid var(--color-base-neutral90);
  }

  &:focus-visible {
    outline: none;
  }

  ${({ $selected }) =>
    $selected &&
    `
      opacity: 1;
      pointer-events: auto;
      background-color: var(--color-base-neutral90);
      color: var(--color-base-neutral-white);
      outline: 1px solid var(--color-base-neutral90);
    `}
`;

export const Sublist = styled.ol`
  ${listUnstyled}
`;
