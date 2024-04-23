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
    ${uiPanelMenu}

    &__list {
      ${listUnstyled}
    }

    &__section {
      padding: 24px 30px 28px 28px;

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
      border-bottom: 2px solid transparent;
      transition: color var(--transition-duration-fast)
          var(--transition-timing-function),
        border-color var(--transition-duration-fast)
          var(--transition-timing-function);

      .appearance-menu__font-style--active & {
        color: var(--strong-color);
        border-color: var(--strong-color);
      }

      .appearance-menu__font-style:hover &,
      .appearance-menu__radio-input.focus-visible ~ & {
        ${defaultHoverStyle}
        border-color: var(--hover-color);
      }

      .appearance-menu__radio-input.focus-visible ~ & {
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
      grid-row-gap: 23px;
      padding-top: 16px;

      ${respond(`grid-row-gap: 29px;`, 50)}
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
      padding-bottom: 3px;
      margin-top: 3px;
      margin-bottom: 3px;

      &:not(:first-of-type) {
        margin-left: 0;
      }

      &--serif {
        font-family: var(--font-family-copy);
        font-size: 25px;

        ${respond(`font-size: 22px;`, 50)}
      }

      &--sans-serif {
        font-family: var(--font-family-heading);
        font-size: 24px;

        ${respond(`font-size: 21px;`, 50)}
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

    &__color-scheme {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: calc(50% - 10px);
      height: 39px;
      border: 3px solid transparent;
      transition: border-color ${defaultTransitionProps};

      ${respond(`width: 96px;`, 50)}

      &--light {
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-base-neutral-white);
      }

      &--dark {
        --hover-color: var(--color-interaction-light);

        color: var(--color-base-neutral-white);
        background-color: var(--color-neutral-ui-extra-dark);
      }

      &--active {
        > svg {
          opacity: 1;
        }
      }

      &:not(.appearance-menu__color-scheme--active) {
        > svg {
          opacity: 0;
        }
      }

      &:hover,
      &:focus-within {
        border-color: var(--hover-color);
        outline: 0;
      }
    }

    &__control-margins {
      display: none;
      border-top: none;

      ${respond(`display: block;`, 50)}
    }

    &__margin-button {
      width: 96px;
      height: 46px;
      background-color: var(--background-color);

      > svg path {
        transition: fill ${defaultTransitionProps};
      }

      &:hover {
        &:not([aria-disabled="true"]) {
          outline: 0;

          > svg path {
            fill: var(--strong-color);
          }
        }
      }

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
