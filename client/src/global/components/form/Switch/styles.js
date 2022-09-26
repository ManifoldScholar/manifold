import styled from "@emotion/styled";
import {
  defaultFocusStyle,
  formLabelPrimary,
  respond,
  formInputSecondary
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

export const IndicatorSwitchInnerSecondary = styled(IndicatorSwitchInner)`
  position: absolute;
  top: -3px;
  right: 0;
`;

const BaseInput = styled.input`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  inline-size: 100%;
  block-size: 100%;
  opacity: 0;
  cursor: pointer;
`;

export const InputSwitch = styled(BaseInput)`
  &:focus-visible ~ ${IndicatorSwitchOuter} {
    ${defaultFocusStyle}
    outline-offset: 2px;
  }

  &:checked ~ ${IndicatorSwitchOuter} {
    ${IndicatorSwitchInner},
    ${IndicatorSwitchInnerSecondary} {
      background-color: var(--active-switch-bg-color);
    }

    ${IndicatorSwitchInner}::before, ${IndicatorSwitchInnerSecondary}::before {
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
  cursor: pointer;
`;

export const IconCheckbox = styled(IconComposer)`
  position: relative;
  top: 1px;
  color: var(--color-base-neutral90);
  visibility: hidden;
`;

export const InputCheckbox = styled(BaseInput)`
  &:checked ~ ${IndicatorCheckbox} {
    background-color: var(--color-base-neutral20);

    ${IconCheckbox} {
      visibility: visible;
    }
  }

  &:focus-visible {
    outline: 0;

    & ~ ${IndicatorCheckbox} {
      ${defaultFocusStyle}
    }
  }
`;

export const LabelTextPrimary = styled.span`
  ${formLabelPrimary}
  display: block;
  margin-block-start: 0;
  margin-block-end: 1em;
`;

export const LabelTextSecondary = styled.span`
  ${formInputSecondary}
  display: block;
  margin-bottom: 0.5em;
  text-transform: inherit;
  letter-spacing: inherit;
  color: var(--color-neutral-text-extra-light);

  ${respond(`height: 38px;`, 60)}
`;

export const LabelSwitch = styled.label`
  position: relative;
  display: block;
`;

export const LabelCheckbox = styled.label`
  position: relative;
  display: block;

  &:hover {
    ${LabelTextSecondary} {
      color: var(--hover-color);
    }
  }

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
