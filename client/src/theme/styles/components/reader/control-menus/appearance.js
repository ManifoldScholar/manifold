import {
  listUnstyled,
  respond,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

export default css`
  .appearance-menu {
    --focus-color: var(--hover-color);

    ${uiPanelMenu}

    &__list {
      ${listUnstyled}
    }

    &__section {
      &:nth-child(even) {
        background-color: var(--color-base-neutral10);
      }

      &:last-child {
        padding: 0;
        border-top: none;

        @include respond($break50) {
          &:last-child {
            padding: 0;
            border-top: none;

            @include respond($break40) {
              padding: 30px 28px;
            }
          }
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

      &:focus-visible {
      }
    }

    &__radio-label {
      border-bottom: 2px solid transparent;
      transition: color var(--transition-duration-fast)
          var(--transition-timing-function),
        border-color var(--transition-duration-fast)
          var(--transition-timing-function);

      .appearance-menu__font-style--active & {
        color: var(--color-neutral-text-extra-dark);
        border-color: var(--color-neutral-text-extra-dark);
      }

      .appearance-menu__font-style:hover &,
      .appearance-menu__radio-input:focus-visible ~ & {
        ${defaultHoverStyle}
        border-color: var(--hover-color);
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
      display: -ms-grid;
      display: grid;
      grid-template:
        "font-style size-serif" auto
        "font-style size-sans" auto / 1fr auto;
      grid-row-gap: 23px;
      padding-top: 16px;
      padding-bottom: 16px;

      @include respond($break50) {
        grid-row-gap: 29px;
      }
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

        @include respond($break50) {
          font-size: 22px;
        }
      }

      &--sans-serif {
        font-family: var(--font-family-heading);
        font-size: 24px;

        @include respond($break50) {
          font-size: 21px;
        }
      }
    }

    // Set of buttons for setting font-size
    &__font-size-button {
      ${buttonUnstyled}
      width: 44px;
      height: 44px;
      color: var(--color-neutral-text-extra-dark);
      vertical-align: top;
      background-color: var(--color-base-neutral-white);
      border-radius: 100%;

      @include respond($break50) {
        width: 35px;
        height: 35px;
      }

      &:disabled {
        color: var(--color-neutral-text-light);
        background-color: var(--color-base-neutral20);
      }

      @include respond($break50) {
        width: 35px;
        height: 35px;
      }

      &:disabled,
      &[aria-disabled="true"] {
        color: var(--color-neutral-text-light);
        cursor: default;
        background-color: var(--color-base-neutral20);
      }

      &:not(:first-child) {
        margin-left: 15px;
      }
    }

    &__color-buttons-container {
      padding: 15px 0;
    }

    &__color-scheme {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: calc(50% - 10px);
      height: 39px;
      border: 3px solid transparent;
      transition: border-color ${defaultTransitionProps};

      @include respond($break50) {
        width: 96px;
      }

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

      @include respond($break50) {
        display: block;
      }
    }

    &__menu-icon {
      &--dark {
        fill: var(--color-base-neutral80);
      }

      &--light {
        fill: var(--color-base-neutral40);
      }
    }

    &__margin-button {
      width: 96px;
      height: 46px;
      background-color: var(--color-base-neutral-white);

      > svg path {
        transition: fill ${defaultTransitionProps};
      }

      &:hover {
        &:not([aria-disabled="true"]) {
          outline: 0;

          > svg path {
            fill: var(--color-neutral-text-extra-dark);
          }
        }
      }

      &[aria-disabled="true"] {
        cursor: default;
        background-color: var(--color-base-neutral20);

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
