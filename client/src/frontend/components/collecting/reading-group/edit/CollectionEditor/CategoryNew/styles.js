import styled from "@emotion/styled";
import {
  utilityPrimary,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

const collectableMinHeight = `2.4rem`;
const inputHeight = collectableMinHeight;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  display: flex;
  align-items: center;
  gap: min(1vw, 16px);
  height: ${inputHeight};
  padding-inline-start: 20px;
  padding-inline-end: 16px;
  font-size: 14px;
  letter-spacing: 0.089em;
  background-color: var(--button-tertiary-bg-color);
  border-radius: var(--box-border-radius);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover,
  &:focus-visible {
    color: var(--strong-color);
    background-color: var(--color-accent-primary-light);
    outline: none;
  }
`;
