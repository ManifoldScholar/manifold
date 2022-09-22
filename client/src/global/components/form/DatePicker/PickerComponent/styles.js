import styled from "@emotion/styled";
import {
  respond,
  defaultTransitionProps,
  buttonUnstyled
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";
import BaseMaskedInput from "react-text-mask";

const TOGGLE_SIZE = 32;
const TOGGLE_PADDING = 12;
const ICON_SIZE = 24;
const ICON_PADDING = 6;

export const Label = styled.label`
  font-size: 12px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.125em;
  display: block;
  margin-bottom: 1em;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const CalendarIcon = styled(IconComposer)`
  position: absolute;
  top: 50%;
  left: 0;
  color: var(--weak-color);
  transform: translateY(-45%);
`;

export const MaskedInput = styled(BaseMaskedInput)`
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.015em;
  border-radius: 0;
  width: 100%;
  height: 32px;
  padding-block: 0;
  padding-inline-end: ${TOGGLE_SIZE + TOGGLE_PADDING}px !important;
  padding-inline-start: ${ICON_SIZE + ICON_PADDING}px !important;
  font-size: 16px;
  vertical-align: top;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid var(--color-neutral-ui-dull-light);
  transition: border-color ${defaultTransitionProps};
  appearance: none;

  ${respond(
    `height: 42px;
  font-size: 18px;`,
    60
  )}

  &:focus-visible {
    border-color: var(--focus-color);
    outline: 0;
  }

  &::placeholder {
    color: var(--color-neutral-ui-light);
  }
`;

export const Toggle = styled.button`
  ${buttonUnstyled}
  position: absolute;
  top: 50%;
  right: 0;
  color: currentColor;
  transform: translateY(-50%);
`;
