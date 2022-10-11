import styled from "@emotion/styled";
import { entityFilterForm } from "theme/styles/variables/crossComponent";
import {
  buttonUnstyled,
  inputQuaternary,
  outlineOnFocus,
  defaultTransitionProps
} from "theme/styles/mixins";

export const Form = styled.form`
  flex-basis: ${entityFilterForm.searchMinWidth}px;

  input {
    border-width: 1px;
    border-radius: 8px;
    font-family: var(--font-family-sans);

    &.focus-visible {
      &::placeholder {
        color: var(--focus-color);
      }
    }
  }
`;

export const SearchButton = styled.div`
  position: relative;

  .icon {
    ${buttonUnstyled}
    ${outlineOnFocus()}
    position: absolute;
    top: 50%;
    left: 10px;
    margin-top: -11px;
    font-size: 17px;
  }

  input {
    ${inputQuaternary}
    width: 100%;
    padding-left: 40px;
    border-color: var(--color-base-neutral40);
    border-radius: 8px;
    appearance: none;
    transition: color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};
    font-family: var(--font-family-sans);

    &::placeholder {
      color: var(--color-base-neutral30);
    }

    &.focus-visible {
      color: var(--color-base-neutral-white);
      border-color: var(--focus-color);
    }
  }
`;
