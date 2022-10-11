import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import {
  respond,
  fluidScale,
  formInputBase,
  defaultTransitionProps
} from "theme/styles/mixins";

const VISIBILITY_TOGGLE_SIZE = 32;

export const Toggle = styled.span`
  position: absolute;
  top: ${(-1 / 4) * VISIBILITY_TOGGLE_SIZE - 1}px;
  left: 80px;
  width: ${VISIBILITY_TOGGLE_SIZE}px;
  height: ${VISIBILITY_TOGGLE_SIZE}px;
  color: var(--color-base-neutral70);
  cursor: pointer;

  &:focus-visible {
    outline: 0;
  }
`;

export const Icon = styled(IconComposer)`
  position: absolute;
  cursor: pointer;
`;

/* Input styles here are the same as in BaseInput, so we should find a way to share them. */
export const BaseInput = styled.input`
  ${formInputBase}
  width: 100%;
  outline: 0;
  border: 1px solid;
  transition: border-color ${defaultTransitionProps};
  border-radius: 0;
  appearance: none;
  outline: 0;

  &:focus,
  &:focus-visible {
    border-color: var(--Input-focus-color);
  }
`;

export const PrimaryInput = styled(BaseInput)`
  --Input-focus-color: var(--hover-color);

  font-size: ${fluidScale("20px", "17px")};
  height: 60px;
  padding: 0.7em 1em;
  background-color: var(--color-base-neutral05);
  border-color: transparent;

  .bg-neutral05 & {
    background-color: var(--color-base-neutral-white);
  }
`;

export const SecondaryInput = styled(BaseInput)`
  --Input-focus-color: var(--focus-color);

  /* Explicit height so that elements can line up */
  height: 32px;
  padding: 0;
  font-size: ${fluidScale("18px", "16px")};
  vertical-align: top;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid var(--input-border-color);

  ${respond(`height: 42px;`, 60)}

  &::placeholder {
    color: var(--input-placeholder-color);
  }

  &:-webkit-autofill {
    box-shadow: 0 0 0 1000px var(--background-color) inset;
    -webkit-text-fill-color: var(--input-autofill-color) !important;
  }
`;
