import {
  listUnstyled,
  respond,
  buttonUnstyled,
  defaultTransitionProps,
  defaultHoverStyle
} from "theme/styles/mixins";
import { uiPanelMenu } from "../uiPanelMenu";

export default `
  .appearance-menu {
    --control-menu-button-bg-color: var(--box-bg-color);

    ${uiPanelMenu}

    &__list {
      ${listUnstyled}
    }

    &__section {
      padding: 24px 30px 24px 28px;

      &:nth-child(even) {
        background-color: var(--box-medium-bg-color);
      }

      &:last-child {
        padding: 0;
        border-top: none;
        ${respond(`padding: 24px 30px 28px 28px;`, 40)}
      }

      &:has(.appearance-menu__font-control-group) {
        & .control-menu__legend {
          margin-block-end: 0;
        }
      }
    }

    &__radio-group {
      height: 100%;
      padding: 0;
      margin: 0;
      border: 0;
    }

    &__radio-stack {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    &__radio-input {
      position: absolute;
      z-index: -5;
      opacity: 0;
    }

    &__radio-label {
      color: var(--reader-color);
      border-bottom: 2px solid transparent;
      transition: color var(--transition-duration-fast)
          var(--transition-timing-function),
        border-color var(--transition-duration-fast)
          var(--transition-timing-function);

      .appearance-menu__font-style--active & {
        border-color: currentColor;
      }

      .appearance-menu__font-style:hover &,
      .appearance-menu__radio-input:focus-visible ~ & {
        ${defaultHoverStyle}
        border-color: var(--hover-color);
      }

      .appearance-menu__radio-input:focus-visible ~ & {
        outline: 1px solid;
        outline-offset: 4px;
      }
    }

    &__button-base {
      ${buttonUnstyled}

      &:not(:first-of-type) {
        margin-left: 20px;
      }
    }

    &__button-group {
      display: inline-flex;
      flex-direction: column;
      gap: 8px;
      text-align: center;

      & + & {
        margin-left: 20px;
      }
    }

    &__button-label {
      font-size: 16px;
      font-family: var(--font-family-heading);
    }

    &__primary-hover-button {
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps},
        border-color ${defaultTransitionProps};

      &:hover:not(:disabled):not([aria-disabled="true"]) {
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-interaction-light);
      }
    }

    &__font-control-group {
      display: grid;
      grid-template:
        "font-style size-serif" auto
        "font-style size-sans" auto / 1fr auto;
      grid-row-gap: 20px;
      padding-top: 16px;
    }

    &__font-style-control {
      grid-area: font-style;
    }

    &__font-size-control {
      display: flex;
      justify-content: space-between;

      &--serif {
        grid-area: size-serif;
      }

      &--sans {
        grid-area: size-sans;
      }
    }

    /* <button> that sets font type */
    &__font-style {
      position: relative;
      display: block;
      padding-bottom: 5px;
      margin-top: 3px;
      margin-bottom: 3px;

      &:not(:first-of-type) {
        margin-left: 0;
      }

      &--serif {
        font-family: var(--font-family-copy);
        font-size: 21px;
      }

      &--sans-serif {
        font-family: var(--font-family-heading);
        font-size: 19px;
      }
    }

    &__font-size-button {
      ${buttonUnstyled}
      width: 44px;
      height: 44px;
      color: var(--strong-color);
      vertical-align: top;
      background-color: var(--background-color);
      border-radius: 100%;

      ${respond(
        `width: 35px;
      height: 35px;`,
        50
      )}

      &:disabled,
      &[aria-disabled="true"] {
        color: var(--disabled-control-color);
        cursor: default;
        background-color: var(--disabled-control-bg-color);
      }

      &:not(:first-child) {
        margin-left: 15px;
      }
    }

    &__color-scheme,
    &__high-contrast,
    &__margin-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 96 / 50;
      width: calc(50% - 10px);
      border: 3px solid transparent;
      transition: background-color ${defaultTransitionProps}, border-color ${defaultTransitionProps};

      ${respond(`width: 96px;`, 50)}

      &:is(:hover, :focus-within, [aria-pressed="true"]):not([aria-disabled="true"]) {
        border-color: var(--hover-color);
        outline: 0;
      }
    }

    &__color-scheme {
      &--light {
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-base-neutral-white);
      }

      &--dark {
        --hover-color: var(--color-interaction-light);

        color: var(--color-base-neutral-white);
        background-color: var(--color-neutral-ui-extra-dark);
      }

      &[aria-pressed="true"] {
        > svg {
          opacity: 1;
        }
      }

      &:not(.appearance-menu__color-scheme[aria-pressed="true"]) {
        > svg {
          opacity: 0;
        }
      }
    }

    &__high-contrast {
      background-color: var(--background-color);
    }

    &__high-contrast-visual {
      padding-inline: 0.5ch;
      font-family: var(--font-family-copy);
      font-size: 24px;
      font-weight: medium;
      transition: background-color ${defaultTransitionProps};

      @media (forced-colors: active) {
        forced-color-adjust: none;
      }

      &--low {
        color: var(--reader-color);
        background-color: var(--color-annotation-primary-pale);
        background-color: light-dark(var(--color-annotation-primary-pale), var(--color-annotation-primary-pale-low-contrast));
      }

      &--high {
        color: var(--background-color);
        background-color: var(--color-annotation-primary-dark-high-contrast);
        background-color: light-dark(var(--color-annotation-primary-dark-high-contrast), var(--color-annotation-primary-light-high-contrast));
      }
    }

    &__high-contrast-button {
      ${buttonUnstyled}
      display: flex;
      gap: 12px;
      inline-size: 100%;
      margin-block-start: 4px;
      font-family: var(--font-family-heading);
    }

    &__control-margins {
      display: none;
      border-top: none;

      ${respond(`display: block;`, 50)}
    }

    &__margin-button {
      background-color: var(--box-bg-color);
      background-color: light-dark(var(--background-color), var(--box-bg-color));

      &[aria-disabled="true"] {
        cursor: default;
        color: var(--disabled-control-color);
        background-color: var(--disabled-control-bg-color);

        > svg {
          opacity: 0.5;
        }
      }
    }

    &__reload-icon {
      margin-right: 10px;
    }
  }
`;
