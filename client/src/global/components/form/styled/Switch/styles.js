import styled from "@emotion/styled";
import {
  defaultFocusStyle,
  formLabelPrimary,
  setHoverStyle,
  respond
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

const BOOLEAN_HEIGHT = 26;
const BOOLEAN_WIDTH = BOOLEAN_HEIGHT * 2;
const BOOLEAN_PADDING = 4;

/* See note in renderSwitchIndicator, also checked and focus styles for InputCheckbox. */
export const IndicatorSwitchOuter = styled.span``;

export const IndicatorSwitchInner = styled.span`
  position: relative;
  display: block;
  width: ${BOOLEAN_WIDTH}px;
  height: ${BOOLEAN_HEIGHT}px;
  cursor: pointer;
  background-color: var(--inactive-switch-bg-color);
  border-radius: ${BOOLEAN_HEIGHT}px;
  transition: background-color var(--transition-duration-slow)
    var(--transition-timing-function);

  &::before {
    position: absolute;
    top: ${BOOLEAN_PADDING}px;
    left: ${BOOLEAN_PADDING}px;
    width: ${BOOLEAN_HEIGHT - BOOLEAN_PADDING * 2}px;
    height: ${BOOLEAN_HEIGHT - BOOLEAN_PADDING * 2}px;
    content: "";
    background-color: var(--switch-toggle-color);
    border-radius: ${BOOLEAN_HEIGHT}px;
    transition: transform var(--transition-duration-default)
      cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }
`;

export const InputSwitch = styled.input`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  inline-size: 100%;
  block-size: 100%;
  opacity: 0;
  cursor: pointer;

  &:focus ~ ${IndicatorSwitchOuter}, &:focus-visible ~ ${IndicatorSwitchOuter} {
    ${defaultFocusStyle}
    outline-offset: 2px;
  }

  &:checked ~ ${IndicatorSwitchOuter} {
    ${IndicatorSwitchInner} {
      background-color: var(--active-switch-bg-color);
    }

    &::before {
      transform: translateX(${BOOLEAN_WIDTH - BOOLEAN_HEIGHT}px);
    }
  }
`;

export const IndicatorCheckbox = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-right: 12px;
  text-align: center;
  vertical-align: middle;
  background-color: var(--color-base-neutral20);
  border-radius: 3px;
`;

export const IconCheckbox = styled(IconComposer)`
  position: relative;
  top: 1px;
  color: var(--color-base-neutral90);
  visibility: hidden;
`;

export const InputCheckbox = styled.input`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  inline-size: 100%;
  block-size: 100%;
  opacity: 0;
  cursor: pointer;

  &:checked ~ ${IndicatorCheckbox} {
    background-color: var(--color-base-neutral20);

    ${IconCheckbox} {
      visibility: visible;
    }
  }

  &:focus,
  &:focus-visible {
    outline: 0;

    & ~ ${IndicatorCheckbox} {
      ${defaultFocusStyle}
    }
  }
`;

export const LabelSwitch = styled.label`
  position: relative;
  display: block;
`;

export const LabelCheckbox = styled.label`
  ${setHoverStyle()}
  position: relative;
  display: block;

  ${respond(`display: inline-block;`, 20)}

  ${respond(
    `
      & + & {
        margin-left: 32px;
      }
    `,
    50
  )}
`;

export const LabelText = styled.span`
  ${formLabelPrimary}
  display: block;
  margin-top: 0;
  margin-bottom: 0.5em;

  ${({ $below }) =>
    $below &&
    `margin-top: 0.6em;
    margin-bottom: 0;
    `}
`;