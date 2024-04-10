import {
  breakpointLessOne,
  respond,
  buttonUnstyled,
  buttonTrimPrimary,
  utilityPrimary,
  defaultTransitionProps,
  defaultHoverStyle,
  fillOnFocus,
  rgba
} from "theme/styles/mixins";

export default `
  .utility-button {
    ${buttonUnstyled}
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-semibold);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.125em;

    &__icon:not(.utility-button__icon--light),
    &__text:not(.utility-button__text--light) {
      .utility-button:not(:disabled):hover & {
        color: var(--strong-color);
      }

      .utility-button:disabled & {
        color: var(--weak-color);
        opacity: 0.5;
      }
    }

    &__icon {
      margin-left: -3px;
      transition: color ${defaultTransitionProps};

      &--highlight {
        color: var(--highlight-color);
      }

      &--notice {
        color: var(--error-color);
      }

      &--download {
        color: var(--color-base-neutral30);
      }
    }

    &__text {
      display: none;
      transition: color ${defaultTransitionProps};

      ${respond(`display: block;`, 40)}

      &--light {
        color: var(--extra-strong-color);
      }

      &--highlight {
        color: var(--highlight-color);
      }

      &--dark-green {
        color: var(--color-interaction-dark);
      }

      &--large {
        font-size: 14px;
      }

      &--underlined {
        text-decoration-line: underline;
      }

      .utility-button:hover & {
        ${defaultHoverStyle}
      }

      .utility-button__icon + & {
        margin-left: 0.417em;
      }
    }
  }

  .utility-button-group {
    &--inline {
      max-height: 26px;

      > *:not(:last-child) {
        margin-right: 1em;

        ${respond(`margin-right: 2em;`, 40)}
      }
    }

    &--stack {
      display: flex;

      ${respond(`flex-direction: column;`, 65)}

      > * + * {
        ${respond(`margin-left: 1em;`, breakpointLessOne(65), "max")}

        ${respond(`margin-top: 1em;`, 65)}
      }
    }
  }

  .button-primary {
    ${buttonUnstyled}
    ${utilityPrimary}
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 23px 16px;
    font-size: 14px;
    text-decoration: none;
    letter-spacing: 0.089em;
    color: var(--color);
    border: 1px solid var(--hover-color);
    border-radius: var(--box-border-radius);
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};

    &:hover,
    &:active {
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--color-interaction-light);
      border-color: var(--color-interaction-light);
    }

    &--gray {
      color: var(--color-base-neutral75);
      background-color: var(--color-base-neutral10);
      border-color: var(--color-base-neutral10);

      &:hover {
        color: var(--color-base-neutral95);
        background-color: var(--color-base-neutral20);
        border-color: var(--color-base-neutral20);
      }
    }

    &--dull {
      border-color: var(--color-base-neutral70);

      &:hover,
      &:active {
        background-color: var(--color-base-neutral10);
        border-color: var(--color-base-neutral70);
      }

      .bg-neutral05 & {
        &:hover {
          color: var(--color-base-neutral-white);
          background-color: var(--color-base-neutral-50);
        }
      }
    }

    &--rounded {
      --box-border-radius: 6px;
    }

    &__icon {
      position: relative;
      top: 1px;
      margin-left: 10px;
    }
  }

  .button-icon-primary {
    ${buttonUnstyled}
    ${utilityPrimary}
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    padding-right: 28px;
    padding-left: 28px;
    font-size: 12px;
    font-weight: var(--font-weight-bold);
    text-align: center;
    text-decoration: none;
    border: 1px solid var(--hover-color);
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};

    ${respond(
      `
        min-height: 58px;
        font-size: 14px;
      `,
      60
    )}

    &:hover,
    &:active {
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--color-interaction-light);
      border-color: var(--color-interaction-light);
    }

    .browse & {
      ${fillOnFocus("var(--color-accent-primary-extra-pale)")}
    }

    &__icon {
      margin-right: 7px;
      color: var(--color-base-neutral50);
      transition: color ${defaultTransitionProps};

      .button-icon-primary:hover & {
        color: var(--color-neutral-ui-extra-dark);
      }

      ${respond(
        `
          width: 54px;
          height: 54px;
        `,
        60
      )}
    }
  }

  .button-icon-secondary {
    ${buttonUnstyled}
    display: inline-flex;
    align-items: center;
    padding: 0.667em 17px 0.778em;
    font-size: 16px;
    font-family: var(--font-family-sans);
    color: var(--highlight-color);
    text-align: left;
    text-decoration: none;
    letter-spacing: 0.015em;
    border: 1px solid var(--highlight-color);
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};

    ${respond(`font-size: 18px;`, 60)}

    &__icon {
      position: relative;
      top: 0.125em;
      margin-right: 0.833em;

      &--large {
        top: 0.08em;
      }

      &--short {
        top: 0;
      }

      &--right {
        margin-right: 0;
        margin-left: 0.833em;
      }
    }

    &:disabled {
      color: var(--color-neutral-ui-dull-light);
      cursor: not-allowed;
      border: 1px solid;
    }

    &.focus-visible:not([disabled]) {
      color: var(--color-base-neutral90);
      background-color: var(--color-accent-primary-pale);
      outline: 0;
    }

    &:hover:not([disabled]),
    &:active:not([disabled]) {
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--color-interaction-light);
      border-color: var(--color-interaction-light);
    }

    &.focus-visible:disabled {
      outline-offset: 2px;
    }

    &--dull {
      color: var(--color);
      border-color: var(--color);

      &:hover:not([disabled]),
      &:active:not([disabled]) {
        color: var(--hover-color);
        background-color: transparent;
        border-color: var(--hover-color);
      }

      &.focus-visible:not([disabled]) {
        color: var(--strong-color);
        background-color: ${rgba("neutral70", 0.3)};
        outline: 0;
      }
    }

    &--full {
      width: 100%;
    }

    &--centered {
      justify-content: center;
    }

    &--smallcaps {
      padding-top: 1.125em;
      padding-bottom: 1.375em;
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.115em;
    }

    &--in-drawer {
      width: 100%;

      ${respond(`width: calc(50% - 17px);`, 90)}
    }

    &--wide {
      width: 100%;
      margin-bottom: 15px;

      ${respond(`width: calc(50% - 17px);`, 85)}
    }
  }

  .buttons-icon-horizontal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 35px;

    &.authoring-drawer {
      margin-top: 20px;
      gap: 24px;
      justify-content: flex-start;
    }

    &.right {
      justify-content: flex-end;
    }

    &.maintain {
      flex-wrap: nowrap;

      .buttons-icon-horizontal__button {
        flex-basis: 100%;
        max-width: 360px;
        margin-bottom: 0;
      }
    }

    ${respond(`font-size: 0;`, 85)}

    &__button {
      margin-bottom: 15px;

      &:not(.button-icon-secondary--in-drawer) {
        flex-basis: calc(50% - 20px);

        &:not(:only-child) {
          flex-grow: 1;
        }
      }

      &--in-dialog {
        margin-bottom: 0;
      }
    }

    .full {
      display: none;

      ${respond(`display: inline;`, 85)}
    }

    .abbreviated {
      ${respond(`display: none;`, 85)}
    }
  }

  .button-secondary {
    ${buttonUnstyled}
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.857em 30px 0.929em;
    font-size: 12px;
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-semibold);
    color: var(--strong-color);
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.089em;
    background-color: var(--color-accent-primary);
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps};

    ${respond(`font-size: 14px;`, 60)}

    &:hover:not(:disabled) {
      color: var(--strong-color);
      background-color: var(--color-accent-primary-dull);
    }

    &.focus-visible {
      outline-color: var(--strong-color);
    }

    &:active {
      background-color: var(--color-accent-primary-medium);
    }

    &--with-room {
      margin-top: 40px;
    }

    &--dull {
      background-color: var(--button-dull-bg-color);

      &:hover:not(:disabled) {
        background-color: var(--color-base-neutral20);
      }

      &:active {
        color: var(--color-base-neutral-white);
        background-color: var(--color-base-neutral20);
      }
    }

    &--outlined {
      color: var(--highlight-color);
      background: none;
      border: 1px solid var(--hover-color);

      &:hover:not(:disabled) {
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--hover-color);
      }

      .bg-neutral90 &,
      .bg-neutral100 &,
      .drawer-backend & {
        --highlight-color: var(--color-base-neutral-white);

        &:not(.button-secondary--dull):hover,
        &:not(.button-secondary--dull).focus-visible {
          color: var(--color-neutral-text-extra-dark);
          background-color: var(--hover-color);
        }
      }

      &.button-secondary--dull {
        --highlight-color: var(--color-base-neutral45);
        --hover-color: var(--color-base-neutral45);

        &:hover:not(:disabled),
        &.focus-visible:not(:disabled) {
          color: var(--color-neutral-text-extra-dark);
          background-color: var(--highlight-color);
          outline: 0;
        }
      }
    }

    &--accent-pale {
      background-color: var(--color-accent-primary-pale);

      &:hover {
        background-color: var(--color-accent-primary);
      }

      &.button-secondary--dull {
        background-color: var(--color-base-neutral10);

        &:hover {
          background-color: var(--color-base-neutral20);
        }
      }
    }

    &--dark {
      justify-content: flex-start;
      color: var(--color-neutral-ui-extra-light);
      text-align: left;
      background-color: var(--color-base-neutral80);

      .bg-neutral90 & {
        &:hover,
        &:active {
          color: var(--color-neutral-text-extra-dark);
        }
      }
    }

    &--color-white {
      color: var(--color-base-neutral-white);
    }

    &__icon {
      position: relative;
      top: 1px;

      + .button-secondary__text {
        margin-left: 10px;
      }
    }

    &__text {
      &--white {
        color: var(--color-base-neutral-white);
      }

      &--hover-dark {
        transition: color ${defaultTransitionProps};

        .button-secondary:hover &,
        .button-secondary.focus-visible & {
          color: var(--color-base-neutral90);
        }
      }

      + .button-secondary__icon {
        margin-left: 10px;
      }
    }
  }

  .button-tertiary {
    ${utilityPrimary}
    display: inline-block;
    padding: 5px 14px 7px;
    font-size: 12px;
    color: var(--color-neutral-text-extra-dark);
    text-align: center;
    text-decoration: none;
    letter-spacing: 0.134em;
    white-space: nowrap;
    background-color: var(--button-tertiary-bg-color);
    border: 1px solid var(--button-tertiary-bg-color);
    border-radius: 4px;
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};

    &:hover,
    &.focus-visible,
    &--active {
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--button-tertiary-bg-hover-color);
      border-color: var(--button-tertiary-bg-hover-color);
      outline: 0;
    }

    &--neutral {
      background-color: var(--background-color);
      border-color: currentColor;
    }

    &--outlined {
      background-color: transparent;
      border-color: currentColor;
    }
  }

  .button-trim-primary {
    ${buttonTrimPrimary}
  }

  .close-button-primary {
    font-size: 15px;
    color: var(--color-base-neutral50);
    text-decoration: none;
    cursor: pointer;
  }

  .button-lozenge-primary {
    ${utilityPrimary}
    padding: 6px 13px;
    font-size: 12px;
    text-decoration: none;
    background-color: var(--box-bg-color);
    border: none;
    border-radius: 1em;
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps};

    &:hover,
    &.focus-visible {
      color: inherit;
      background-color: var(--color-accent-primary);
    }

    &--warn {
      &:hover,
      &.focus-visible {
        color: var(--color-base-neutral-white);
        background-color: var(--error-color);
      }
    }
  }

  .button-lozenge-secondary {
    ${buttonUnstyled}
    ${utilityPrimary}
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-right: 15px;
    padding-left: 15px;
    font-size: 14px;
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    text-transform: none;
    letter-spacing: 0;
    border: 1px solid;
    border-radius: 16px;
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};

    &:hover {
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--hover-color);
      border-color: var(--hover-color);
    }

    &.focus-visible {
      color: var(--color-neutral-text-extra-dark);
      border-color: var(--hover-color);
      outline: none;
    }

    span {
      padding-top: 7px;
      padding-bottom: 9px;
    }

    svg {
      width: 24px;
      height: 24px;
      margin-right: 6px;
      margin-left: -5px;
      padding-bottom: 2px;
    }
  }
`;
