import styled from "styled-components";
import { defaultTransitionProps } from "theme/styles/mixins";

const baseInteractiveStyles = `
background-color: var(--color-base-neutral05);
border: 1px solid var(--color-base-neutral70);
border-radius: 6px;
cursor: pointer;
transition: color ${defaultTransitionProps}, background-color ${defaultTransitionProps};

&:disabled {
  background-color: var(--color-base-neutral05);
  opacity: 0.3;
  cursor: not-allowed;
}

`;

export const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  grid-area: nav;
  justify-self: center;
`;

export const NavButton = styled.button`
  ${baseInteractiveStyles}
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  text-decoration: none;

  &:hover:not(:disabled) {
    background-color: var(--color-base-neutral90);
    border-color: var(--color-base-neutral90);
    color: var(--color-base-neutral-white);
  }

  &:focus-visible:not(:disabled) {
    background-color: var(--color-base-neutral20);
    border-color: var(--color-base-neutral20);
    outline: 2px solid var(--color-base-neutral90);
    color: var(--color-base-neutral90);
  }
`;

export const PageInfo = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 10px;
  white-space: nowrap;
`;

export const PageInput = styled.input`
  ${baseInteractiveStyles}
  min-width: 44px;
  padding-block-start: 5px;
  padding-block-end: 6px;
  text-align: center;
  appearance: none;

  &:hover:not(:disabled),
  &:focus-visible {
    background-color: var(--color-base-neutral-white);
    border-color: var(--color-base-neutral-white);
    outline: 2px solid var(--color-base-neutral90);
  }

  /* Remove number input arrows */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  appearance: textfield;
`;
