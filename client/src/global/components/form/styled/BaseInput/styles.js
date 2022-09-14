import styled from "@emotion/styled";
import {
  formInputBase,
  formLabelPrimary,
  defaultTransitionProps,
  fluidScale,
  respond
} from "theme/styles/mixins";

export const PrimaryLabel = styled.label`
  ${formLabelPrimary}
  display: block;
  margin-block-end: 1em;

  ${({ $hasInstructions }) => $hasInstructions && `margin-block-end: 0.5em;`}
`;

export const SecondaryLabel = styled(PrimaryLabel)`
  margin-block-start: 0;
`;

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

  /* What to do with this depends on what happens with .form-input */
  & + div > button {
    grid-area: input;
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

  /* This is only applied in secondary, not sure if it would be okay in base. */
  &[type="number"] {
    text-align: left;
  }
`;

// Needs styles for notification
