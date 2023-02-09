import styled from "@emotion/styled";
import { buttonUnstyled, defaultTransitionProps } from "theme/styles/mixins";

export const Button = styled.button`
  ${buttonUnstyled}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-block: 1em;
  color: var(--strong-color);
  background-color: none;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  padding-inline: 10px;

  &:hover {
    color: var(--strong-color);
    color: var(--color-accent-primary);
  }

  &[data-active="true"] {
    color: var(--color-accent-primary-medium);
  }

  &:first-child {
    margin-inline-start: -10px;
  }
`;
