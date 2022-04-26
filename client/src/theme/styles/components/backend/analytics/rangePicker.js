import { containerWidth } from "theme/styles/variables/layout";
import {
  formLabelPrimary,
  formInputPrimary,
  defaultTransitionProps,
  respond,
  buttonUnstyled,
  fillOnFocus
} from "theme/styles/mixins";

const CONTAINER_WIDTH = parseInt(containerWidth.inner, 10);
const COLUMNS = 4;
const GUTTER = 20;
const TRACK_MAX_WIDTH = (CONTAINER_WIDTH - GUTTER * (COLUMNS - 1)) / COLUMNS;
const TOGGLE_SIZE = 32;
const TOGGLE_PADDING = 12;
const ICON_SIZE = 24;
const ICON_PADDING = 6;

export default `
  .range-picker {
    --focus-color: var(--color-accent-secondary);
    --hover-color: var(--color-accent-secondary);

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, ${TRACK_MAX_WIDTH}px));
    grid-gap: ${GUTTER}px;

    &__section {
      min-width: 0; /* prevent grid blowout */

      &:last-child {
        grid-column: span 2;
      }
    }

    &__date-input {
      position: relative;
    }

    &__label {
      ${formLabelPrimary}
      display: block;
      margin-bottom: 1em;
    }

    &__input-wrapper {
      position: relative;
    }

    &__input {
      ${formInputPrimary}
      width: 100%;
      /* Explicit height so that elements can line up */
      height: 32px;
      /* Declared in em as it should change with font size */
      padding: 0;
      padding-right: ${TOGGLE_SIZE + TOGGLE_PADDING}px !important;
      padding-left: ${ICON_SIZE + ICON_PADDING}px !important;
      font-size: 16px;
      vertical-align: top;
      background-color: transparent;
      border: 0;
      border-bottom: 1px solid var(--color-neutral-ui-dull-light);
      outline: 0;
      transition: border-color ${defaultTransitionProps};
      transition: border-color ${defaultTransitionProps};
      appearance: none;

      ${respond(
        `height: 42px;
    font-size: 18px;`,
        60
      )}

      &.focus-visible {
        border-color: var(--focus-color);
        outline: 0;
      }

      &::placeholder {
        color: var(--color-neutral-ui-light);
      }
    }

    &__calendar-icon {
      position: absolute;
      top: 50%;
      left: 0;
      color: var(--weak-color);
      transform: translateY(-45%);
    }

    &__picker-toggle {
      ${buttonUnstyled}
      position: absolute;
      top: 50%;
      right: 0;
      color: currentColor;
      transform: translateY(-50%);
    }

    &__preset-group {
      padding: 0;
      margin: 0;
      border: none;
    }

    &__legend {
      ${formLabelPrimary}
      display: block;
      margin-bottom: 1em;
    }

    &__preset-group-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 12px;
      margin-top: 4px;
    }

    &__preset {
      ${fillOnFocus("var(--color-accent-secondary-pale)")}
      color: var(--color-accent-secondary);
    }
  }
`;
