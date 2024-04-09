import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  respond,
  defaultTransitionProps
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Button = styled("button", transientOptions)`
  ${buttonUnstyled}
  ${utilityPrimary}
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding-block-start: 2px;
  padding-block-end: 2px;
  padding-inline-end: var(--padding-lateral);
  padding-inline-start: var(--padding-lateral);
  font-size: 13px;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  ${respond(`font-size: 14px;`, 50)}

  ${({ $expanded }) => {
    if ($expanded) {
      return `
        color: var(--color-neutral-text-extra-dark);
        outline: 0;
        background-color: var(--color-interaction-light);

        &.focus-visible {
          background-color: var(--color-interaction-dark);
        }
      `;
    }
    return `
      &:hover,
      &.focus-visible {
        color: var(--color-neutral-text-extra-dark);
        outline: 0;
        background-color: var(--color-interaction-light);
      }

      &.focus-visible {
        outline: 2px solid;
        outline-offset: -2px;
      }
    `;
  }}
`;
