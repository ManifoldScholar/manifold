import {
  defaultTransitionProps,
  rgba,
  utilityPrimary,
  buttonUnstyled
} from "theme/styles/mixins";

const panelBgColor = "var(--color-base-neutral85)";
const panelBgColorLight = "var(--color-base-neutral-white)";
const tailSize = "16px";

export default `
  .annotation-popup {
    --hover-color: var(--color-interaction-light);

    position: absolute;
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

    &__panel {
      position: relative;
      left: 50%;
      background-color: ${panelBgColor};
      border-radius: var(--box-border-radius);
      box-shadow: 0 12px 22px -3px ${rgba("neutralBlack", 0.39)};
      transition: opacity ${defaultTransitionProps},
        transform ${defaultTransitionProps};
      transform: translateX(-50%);

      &--secondary {
      }

      &--secondary-group {
        position: relative;
      }

      &--top {
        top: 0;
      }

      &--bottom {
        bottom: 0;
      }

      &.panel-appear {
        opacity: 0.01;
        transform: translateX(25%);

        &.panel-appear-active {
          opacity: 1;
          transition: opacity ${defaultTransitionProps},
            transform ${defaultTransitionProps};
          transform: translateX(-50%);
        }
      }

      &.panel-exit {
        opacity: 1;
        transform: translateX(-50%);

        &.panel-exit-active {
          opacity: 0;
          transition: opacity var(--transition-duration-slow)
              var(--transition-timing-function),
            transform var(--transition-duration-slow)
              var(--transition-timing-function);
          transform: translateX(25%);
        }
      }

      .scheme-dark & {
        background-color: ${panelBgColorLight};
      }
    }

    &__note {
      font-family: var(--font-family-heading);
      padding: 1em 17px 1.063em;
      font-size: 16px;
      color: var(--color-base-neutral-white);
      text-align: center;
      letter-spacing: 0.005em;
      background-color: var(--color-base-neutral95);

      &--top {
        border-top-left-radius: var(--box-border-radius);
        border-top-right-radius: var(--box-border-radius);
      }

      &--bottom {
        border-bottom-right-radius: var(--box-border-radius);
        border-bottom-left-radius: var(--box-border-radius);
      }

      .scheme-dark & {
        color: var(--color-base-neutral85);
        background-color: var(--color-base-neutral-white);
      }
    }

    &__header {
      ${utilityPrimary}
      display: flex;
      align-items: center;
      padding: 14px 20px;
      font-size: 14px;
      color: var(--color-base-neutral45);
      background-color: var(--color-base-neutral95);
      border-top-left-radius: var(--box-border-radius);
      border-top-right-radius: var(--box-border-radius);

      .scheme-dark & {
        color: var(--color-base-neutral85);
        background-color: var(--color-base-neutral10);
      }
    }

    &__heading {
      margin-left: 1em;
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
      color: var(--color-base-neutral-white);
      text-align: left;
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      .scheme-dark & {
        color: var(--color-base-neutral85);
      }

      &--dark {
        color: var(--color-base-neutral70);
        background-color: ${panelBgColor};

        + .annotation-popup__tail--down {
          border-color: var(--color-base-neutral90) transparent transparent;
        }

        .scheme-dark & {
          color: ${panelBgColor};
          background-color: var(--color-base-neutral70);
        }
      }

      &--secondary-dark {
        padding-right: 20px;
        padding-left: 20px;
        color: var(--color-base-neutral45);
        background-color: var(--color-base-neutral95);

        .scheme-dark & {
          color: var(--color-base-neutral85);
          background-color: var(--color-base-neutral10);
        }
      }

      &--stacked {
        display: block;
      }

      &:first-of-type:not(:last-of-type):not(.annotation-popup__button--selected) {
        border-top-left-radius: var(--box-border-radius);
        border-top-right-radius: var(--box-border-radius);
      }

      &:last-of-type:not(.annotation-popup__button--selected) {
        border-bottom-right-radius: var(--box-border-radius);
        border-bottom-left-radius: var(--box-border-radius);
      }

      &:hover,
      &--selected {
        color: ${panelBgColor};
        background-color: var(--hover-color);
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

    .button-group {
      + .annotation-popup__button,
      + .button-group {
        border-top: 1.5px var(--color-base-neutral90) solid;
      }
    }

    &__tail {
      --tail-color: ${panelBgColor};

      position: absolute;
      left: 50%;
      display: block;
      width: 0;
      height: 0;
      margin-left: -${tailSize};
      border-style: solid;
      transition: border-color ${defaultTransitionProps};

      &--down {
        top: 100%;
        border-color: var(--tail-color, ${panelBgColor}) transparent transparent;
        border-width: ${tailSize} ${tailSize} 0;

        &.annotation-popup__tail--highlight {
          border-color: var(--color-accent-primary) transparent transparent;
        }

        .annotation-popup__button--secondary-dark + & {
          --tail-color: var(--color-base-neutral95);
        }
      }

      &--up {
        top: -${tailSize};
        border-color: transparent transparent var(--tail-color, ${panelBgColor});
        border-width: 0 ${tailSize} ${tailSize};

        &.annotation-popup__tail--highlight {
          border-color: transparent transparent var(--color-accent-primary);
        }
      }

      .scheme-dark & {
        --tail-color: var(--color-base-neutral-white);
      }

      &--dark {
        --tail-color: var(--color-base-neutral95);

        .scheme-dark & {
          --tail-color: var(--color-base-neutral10);
        }
      }
    }
  }
`;
