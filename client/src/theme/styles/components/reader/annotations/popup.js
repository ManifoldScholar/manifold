import {
  defaultTransitionProps,
  rgba,
  utilityPrimary,
  buttonUnstyled,
  outlineOnFocus
} from "theme/styles/mixins";

const tailSize = "16px";
const transitionDuration = "0.3s";

export default `
  .annotation-popup {
    --focus-color: var(--color-interaction-light);
    --hover-color: var(--color-interaction-light);
    --menu-color: var(--color-base-neutral-white);
    --menu-bg-color: var(--color-base-neutral85);
    --menu-secondary-color: var(--color-neutral-text-light);
    --menu-secondary-bg-color: var(--color-base-neutral95);
    --menu-button-color: var(--menu-color);
    --menu-button-bg-color: var(--menu-bg-color);
    --menu-button-hover-color: var(--menu-bg-color);
    --menu-dark-button-color: var(--color-base-neutral70);
    --menu-dark-button-bg-color: var(--menu-bg-color);
    --menu-selected-button-interaction-color: var(--menu-button-bg-color);
    --menu-selected-button-interaction-background-color: var(--color-accent-primary-pale);
    --menu-tail-color: var(--menu-bg-color);
    --menu-dark-tail-color: var(--color-base-neutral95);
    --group-button-hover-color: var(--menu-bg-color);
    --group-button-hover-bg-color: var(--hover-color);
    --group-button-private-icon-color: var(--menu-secondary-color);
    --manage-groups-link-color: var(--color-neutral-text-light);

    .scheme-dark & {
      --menu-color: var(--color-base-neutral85);
      --menu-bg-color: var(--color-base-neutral-white);
      --menu-secondary-color: var(--color-base-neutral85);
      --menu-secondary-bg-color: var(--color-base-neutral10);
      --menu-button-hover-color: var(--menu-color);
      --menu-dark-button-color: var(--color-base-neutral85);
      --menu-dark-button-bg-color: var(--color-base-neutral70);
      --menu-selected-button-interaction-color: var(--menu-bg-color);
      --menu-selected-button-interaction-background-color: var(--color-interaction-extra-dark);
      --menu-dark-tail-color: var(--color-base-neutral10);
      --group-button-hover-color: var(--menu-button-hover-color);
      --group-button-private-icon-color: var(--color-neutral-ui-light);
      --manage-groups-link-color: #5c5c5c;
    }

    position: absolute;
    contain: layout;
    margin-top: -30px;
    white-space: nowrap;
    visibility: hidden;
    user-select: none;
    opacity: 0;
    transition: top ${defaultTransitionProps}, left ${defaultTransitionProps},
      opacity ${defaultTransitionProps};

    &--visible {
      visibility: visible;
      opacity: 1;
    }

    &__menu {
      /* overrides to reakit inline styles */
      position: absolute !important;
      top: 0 !important;
      left: 50% !important;
      display: block !important;
      /* end overrides to reakit inline styles */
      color: var(--menu-color);
      background-color: var(--menu-bg-color);
      border-radius: var(--box-border-radius);
      box-shadow: 0 12px 22px -3px ${rgba("neutralBlack", 0.39)};
      opacity: 0;
      pointer-events: none;
      transition:
        opacity ${transitionDuration} var(--transition-timing-function),
        transform ${transitionDuration} var(--transition-timing-function);
      transform: translateX(25%);

      &--top {
        /* override reakit inline styles */
        top: 0 !important;
      }

      &--bottom {
        /* override reakit inline styles */
        top: auto !important;
        bottom: 0;
      }

      &--active {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(0);
        transition:
          opacity ${transitionDuration} var(--transition-timing-function),
          transform ${transitionDuration} var(--transition-timing-function);
      }

      &:focus {
        outline: none;
      }

      &.focus-visible {
        ${outlineOnFocus("var(--menu-bg-color)")}
        outline-offset: 2px;
      }
    }

    &__note {
      padding: 1em 17px 1.063em;
      font-size: 16px;
      font-family: var(--font-family-sans);
      text-align: center;
      letter-spacing: 0.005em;
      border-bottom-right-radius: var(--box-border-radius);
      border-bottom-left-radius: var(--box-border-radius);
    }

    &__header {
      ${utilityPrimary}
      display: flex;
      align-items: center;
      padding: 14px 20px;
      font-size: 14px;
      color: var(--menu-secondary-color);
      background-color: var(--menu-secondary-bg-color);
      border-top-left-radius: var(--box-border-radius);
      border-top-right-radius: var(--box-border-radius);
    }

    &__heading {
      margin-left: 1em;
    }

    &__footer {
      margin: 20px 20px 0;
    }

    &__button-group {
      display: flex;
      flex-direction: column;
      max-height: 336px; /* equals 8 items */
      padding-top: 14px;
      padding-bottom: 14px;
      overflow: auto;
    }

    &__button {
      ${buttonUnstyled}
      ${utilityPrimary}
      display: flex;
      align-items: center;
      width: 100%;
      padding: 11px 24px 11px 15px;
      font-size: 14px;
      line-height: 23px;
      text-align: start;
      text-decoration: none;
      color: var(--menu-button-color);
      background-color: var(--menu-button-bg-color);
      transition: none;

      &--dark {
        --menu-button-color: var(--menu-dark-button-color);
        --menu-button-bg-color: var(--menu-dark-button-bg-color);

        + .annotation-popup__tail--down {
          --menu-tail-color: var(--color-base-neutral90);
        }
      }

      &--secondary-dark {
        --menu-button-color: var(--menu-secondary-color);
        --menu-button-bg-color: var(--menu-secondary-bg-color);

        padding-right: 20px;
        padding-left: 20px;
        color: var(--color-base-neutral45);
        background-color: var(--color-base-neutral95);
      }

      &--stacked {
        display: block;
      }

      &:first-child {
        border-top-left-radius: var(--box-border-radius);
        border-top-right-radius: var(--box-border-radius);
      }

      &:last-child {
        border-bottom-right-radius: var(--box-border-radius);
        border-bottom-left-radius: var(--box-border-radius);
      }

      &:hover,
      &:focus,
      &--selected {
        color: var(--menu-button-hover-color);
        background-color: var(--hover-color);
        outline: none;
      }

      &--selected:hover,
      &--selected:focus {
        color: var(--menu-selected-button-interaction-color);
        background-color: var(--menu-selected-button-interaction-background-color);
      }
    }

    &__button-icon {
      margin-right: 13px;

      &--disclosure {
        margin-right: -5px;
        margin-left: 13px;
        transform: rotate(90deg);
      }
    }

    &__button-text {
      position: relative;
      top: -1px;

      &--small {
        overflow: hidden;
        font-size: 17px;
        font-weight: var(--font-weight-regular);
        text-overflow: ellipsis;
        text-transform: none;
        letter-spacing: 0;
        white-space: nowrap;
      }
    }

    &__button-inner-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 175px;
    }

    &__tail {
      position: absolute;
      left: 50%;
      display: block;
      width: 0;
      height: 0;
      margin-left: -${tailSize};
      border-style: solid;

      &--down {
        top: 100%;
        border-color: var(--menu-tail-color) transparent transparent;
        border-width: ${tailSize} ${tailSize} 0;
      }

      &--up {
        top: -${tailSize};
        border-color: transparent transparent var(--menu-tail-color);
        border-width: 0 ${tailSize} ${tailSize};
      }

      &--dark {
        --menu-tail-color: var(--menu-tail-dark-color);
      }
    }
  }
`;
