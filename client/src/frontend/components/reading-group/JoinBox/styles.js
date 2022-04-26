import styled from "@emotion/styled";
import {
  respond,
  utilityPrimary,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

export const Form = styled.form`
  display: flex;
  align-items: stretch;

  ${respond(
    `min-width: 302px;
  padding-left: 20px;`,
    65
  )}
`;

export const Label = styled.label`
  flex-grow: 1;
`;

export const Input = styled.input`
  ${utilityPrimary}
  width: 100%;
  padding: 7px 14px;
  font-size: inherit;
  background-color: var(--color-base-neutral-white);
  border: 1px solid var(--color-base-neutral-white);
  border-radius: 4px;
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
padding: 0 22px;
  margin-left: 12px;
  font-size: inherit;
  color: var(--strong-color);
  background-color: var(--box-strong-bg-color);
  border-radius: 4px;
  transition: background-color ${defaultTransitionProps};

  &:hover,
  &.focus-visible {
    color: inherit;
    background-color: var(--color-base-neutral30);
    outline: 0;
  }
`;
