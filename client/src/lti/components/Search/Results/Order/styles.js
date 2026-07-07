import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  width: fit-content;
`;

export const Select = styled.select`
  appearance: none;
  padding: 6px 32px 9px 10px;
  background-color: var(--color-base-neutral05);
  border: 1px solid var(--color-base-neutral70);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover:not(:disabled) {
    background-color: var(--color-base-neutral-white);
    border-color: var(--color-base-neutral-white);
    outline: 2px solid var(--color-base-neutral90);
  }

  &:focus-visible:not(:disabled) {
    background-color: var(--color-base-neutral20);
    border-color: var(--color-base-neutral20);
    outline: 2px solid var(--color-base-neutral90);
    color: var(--color-base-neutral90);
  }
`;

export const Icon = styled.div`
  position: absolute;
  right: 10px;
  top: 4px;
  pointer-events: none;
`;
