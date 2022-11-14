import styled from "@emotion/styled";
import {
  formLabelPrimary,
  formInstructions,
  respond,
  defaultTransitionProps,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Fieldset = styled.fieldset`
  padding: 0;
  border: none;
`;

export const Instructions = styled.span`
  ${formInstructions}
  display: block;
  margin-block-end: 14px;
  margin-block-start: 0;
  &:last-child {
    margin-block-end: 0;
  }
`;

export const ToggleLabel = styled.span`
  font-size: 14px;
`;

export const Toggle = styled.span`
  position: absolute;
  left: 0;
  display: block;
  user-select: none;
  background-color: var(--color-base-neutral30);
  transition: background-color ${defaultTransitionProps};
  .bg-neutral90 & {
    background-color: var(--color-neutral-ui-dark);
  }
  width: 1.25em;
  height: 1.25em;
  padding-top: 0.313em;
  text-align: center;
  border-radius: 100%;
  &::before {
    display: inline-block;
    width: 0.625em;
    height: 0.625em;
    vertical-align: top;
    content: "";
    background-color: var(--color-base-neutral90);
    border-radius: 100%;
    opacity: 0;
    transition: opacity ${defaultTransitionProps};
  }
  &.inline {
    display: block;
    font-size: 16px;
    ${respond(
      `
        display: inline-block;
        + .radio {
          margin-top: 0;
          margin-left: 35px;
        }`,
      50
    )}
  }
`;

export const RadioInput = styled.input`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
  &:focus-visible ~ ${Toggle} {
    background-color: var(--color-accent-primary-light);
  }
  &:focus-visible ~ ${ToggleLabel} {
    ${defaultFocusStyle}
    outline-offset: 2px;
  }
  &:checked ~ ${Toggle} {
    background-color: var(--color-accent-primary-light);
    &::before {
      opacity: 1;
    }
  }
`;

export const RadioOption = styled.label`
  ${formLabelPrimary}
  position: relative;
  display: inline-block;
  padding-inline-start: 33px;
  margin-block-end: 0;
  font-size: 13px;
  line-height: 1.25em;
  ${respond(`font-size: 16px;`, 60)}
  & + & {
    margin-inline-start: 35px;
  }
`;

export const Legend = styled.legend`
  ${formLabelPrimary}
  display: block;
  margin: 0;
  margin-block-end: 1em;
  font-size: 14px;
  padding: 0;
  border: none;
  + ${Toggle} {
    margin-top: 4px;
  }
  + ${RadioOption} {
    margin-block-start: 0.25em;
  }
`;
