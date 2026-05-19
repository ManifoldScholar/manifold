import styled, { css } from "styled-components";
import { utilityPrimary, defaultTransitionProps } from "theme/styles/mixins";

export const Circle = styled.div`
  border-radius: 50%;
  border: 1px solid var(--color-base-neutral70);
  height: 18px;
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 2px;
`;

const baseHoverStyles = `
  color: var(--color-base-neutral-white);
  background-color: var(--color-base-neutral90);
  border-color: var(--color-base-neutral90);
`;

const pillBase = css`
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-base-neutral70);
  background-color: var(--color-base-neutral05);
  color: var(--color-base-neutral90);
  display: flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  cursor: pointer;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};
`;

export const Toggle = styled.div`
  ${pillBase}

  input:not(:checked) + & {
    svg[data-check-indicator] {
      display: none;
    }
  }

  input:checked + & {
    background-color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);

    path[data-check-path] {
      stroke: var(--color-accent-primary);
    }

    > ${Circle} {
      border-color: var(--color-base-neutral90);
    }

    &:hover {
      ${baseHoverStyles}

      path[data-check-path] {
        stroke: var(--color-base-neutral90);
      }

      > ${Circle} {
        border-color: var(--color-base-neutral-white);
      }
    }
  }

  &:hover {
    ${baseHoverStyles}
  }

  input:focus-visible + & {
    outline: 2px solid var(--color-base-neutral90);
    background-color: var(--color-base-neutral-white);
    border-color: var(--color-base-neutral-white);

    path[data-check-path] {
      stroke: var(--color-base-neutral-white);
    }
  }
`;

export const Label = styled.span`
  ${utilityPrimary}
  font-size: 12px;
`;
