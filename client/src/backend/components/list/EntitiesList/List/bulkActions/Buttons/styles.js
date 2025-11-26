import styled from "@emotion/styled";
import { Button } from "backend/components/list/EntitiesList";

export const DeleteButton = styled(Button)`
  color: var(--error-color);
  border-color: var(--error-color);

  &:hover:not([disabled]) {
    color: var(--color-neutral-text-extra-dark);
    background: var(--error-color);
    border-color: var(--error-color);
  }

  &:disabled {
    color: var(--color-base-neutral75);
    border-color: var(--color-base-neutral75);
    pointer-events: none;
  }

  &:focus-visible:not([disabled]) {
    color: var(--color-neutral-text-extra-dark);
    border-color: var(--error-color);
    background: var(--color-base-red20);
  }
`;

export const Toggle = styled(Button)`
  &.active {
    color: var(--color-neutral-text-light);
    border-color: var(--color-neutral-text-light);

    &:hover {
      color: var(--color-neutral-text-extra-dark);
      background: var(--color-neutral-text-light);
      border-color: var(--color-neutral-text-light);
    }

    &:focus-visible {
      color: var(--color-neutral-text-extra-dark);
    }
  }
`;
