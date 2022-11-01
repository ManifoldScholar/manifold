import styled from "@emotion/styled";
import {
  defaultFocusStyle,
  formLabelPrimary,
  respond,
  formInputSecondary
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";
import { transientOptions } from "helpers/emotionHelpers";

const BOOLEAN_HEIGHT = 26;
const BOOLEAN_WIDTH = BOOLEAN_HEIGHT * 2;
const BOOLEAN_PADDING = 4;

/* See note in renderSwitchIndicator, also checked and focus styles for InputCheckbox. */
export const IndicatorSwitchOuter = styled.span`
  border-bottom: 1px solid var(--input-border-color);
`;

export const IndicatorSwitchInner = styled.span`
  position: relative;
  display: block;
  width: ${BOOLEAN_WIDTH}px;
  height: ${BOOLEAN_HEIGHT}px;
  cursor: pointer;
  background-color: var(--inactive-switch-bg-color);
  border-radius: ${BOOLEAN_HEIGHT}px;
  transform: translateY(var(--IndicatorSwitchInner-translateY, -10%));
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
  &:focus-visible ~ ${IndicatorSwitchOuter} ${IndicatorSwitchInner} {
    ${defaultFocusStyle}
    outline-offset: 2px;
  }

  &:checked ~ ${IndicatorSwitchOuter} {
    ${IndicatorSwitchInner} {
      background-color: var(--active-switch-bg-color);
    }

    ${IndicatorSwitchInner}::before {
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

  ~ :last-child {
    flex-basis: 75%;
    margin-top: 0;
  }
`;

export const LabelTextPrimary = styled("span", transientOptions)`
  ${formLabelPrimary}
  flex-basis: var(--Switch-child-flex-basis, 100%);
  margin-block-start: 0;
  ${({ $marginEnd }) => $marginEnd && `margin-block-end: 1em;`}

  ~ ${IndicatorSwitchOuter} {
    flex-basis: var(--Switch-child-flex-basis, 100%);
    border-bottom: none;
  }
`;

export const LabelTextSecondary = styled.span`
  ${formInputSecondary}
  flex-grow: 1;
  flex-basis: var(--Switch-child-flex-basis, 66.666%);
  height: auto;
  min-height: 32px;
  display: block;
  padding-right: 0.5em;
  padding-bottom: 0.5em;
  text-transform: inherit;
  letter-spacing: inherit;
  color: var(--strong-color);

  ${respond(`min-height: 38px;`, 60)}
`;

export const Label = styled.label`
  position: relative;
  display: flex;
  flex-wrap: wrap;

  ${({ $inline, $below }) =>
    `
      ${
        $inline
          ? `--Switch-child-flex-basis: auto;
        --IndicatorSwitchInner-translateY: 0;

        align-items: center;
        gap: 1em;
      `
          : ``
      }
      ${$below ? `--input-border-color: transparent;` : ``}
    `}
`;
