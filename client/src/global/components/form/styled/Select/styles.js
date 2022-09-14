import styled from "@emotion/styled";
import BaseErrorable from "global/components/form/Errorable";
import IconComposer from "global/components/utility/IconComposer";
import { formInputSecondary, textTruncate } from "theme/styles/mixins";

const FORM_SELECT_ICON_SIZE = 24;
const FORM_SELECT_ICON_PADDING = 12;
const FORM_SELECT_INLINE_END_PADDING =
  FORM_SELECT_ICON_SIZE + 2 * FORM_SELECT_ICON_PADDING;

export const Label = styled.label`
  ${({ $rounded }) => $rounded && `margin-block-end: 1em;`}
`;

export const SelectWrapper = styled.div`
  ${({ $secondary }) =>
    !$secondary &&
    `
      position: relative;
      display: inline-block;
      width: 100%;`}
`;

// Uses the same styles as SelectWrapper; use as prop. Also, necessary?
export const Errorable = styled(BaseErrorable)``;

/* eslint-disable no-nested-ternary */
export const Select = styled.select`
  --Select-focus-color: ${({ $secondary }) =>
    $secondary ? `var(--highlight-color)` : `var(--hover-color)`}
  --Select-padding: ${({ $secondary, $rounded }) =>
    $rounded
      ? `0 ${FORM_SELECT_INLINE_END_PADDING}px 0 13px`
      : $secondary
      ? `0 ${FORM_SELECT_INLINE_END_PADDING}px 0.75em 0`
      : `1.286em 55px 1.286em 2.214em`}
  --Select-text-shadow-color: ${({ $secondary, $rounded }) =>
    $rounded
      ? `var(--medium-color)`
      : $secondary
      ? `var(--color-neutral-text-extra-light)`
      : `var(--color-neutral-text-dark)`}

  ${formInputSecondary}
  padding: var(--Select-padding);

  &:focus {
    border-color: var(--Select-focus-color);
  }

  &:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 var(--Select-text-shadow-color);
  }

  ${({ $secondary }) =>
    !$secondary &&
    `
    display: inline-block;
    height: 4.286em;
    margin: 0;
    background-color: var(--color-base-neutral05);
    border: 1px solid transparent;

    .bg-neutral05 & {
      background-color: var(--color-base-neutral-white);
    }

    option {
      color: var(--color-neutral-text-extra-dark);
    }
    `}

    ${({ $rounded }) =>
      $rounded &&
      `
      ${textTruncate}
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.115em;
      width: auto;
      height: 40px;
      font-size: 13px;
      background-color: var(--select-bg-color); /* required for option to inherit in FF */
      border: 1px solid var(--color-neutral-ui-dull-light);
      border-radius: var(--box-border-radius);
      `}
`;

export const Icon = styled(IconComposer)`
  position: absolute;
  top: 42%;
  right: 4px;
  color: var(--highlight-color);
  pointer-events: none;
  transform: translateY(-50%);

  ${({ $rounded }) =>
    $rounded &&
    `
    top: 50%;
    right: ${FORM_SELECT_ICON_PADDING}px;
    width: ${FORM_SELECT_ICON_SIZE}px;
    height: ${FORM_SELECT_ICON_SIZE}px;
    color: currentColor;
  `}
`;
