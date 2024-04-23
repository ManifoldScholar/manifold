import {
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  transparentize,
  defaultFocusStyle
} from "theme/styles/mixins";

export default `
  .control-menu {
    &__header,
    &__section {
      padding: 15px 30px;
    }

    &__header {
      display: block;
      width: 100%;
      background-color: var(--box-medium-bg-color);

      &--with-icon {
        padding-top: 8px;
        padding-bottom: 8px;
      }
    }

    &__heading {
      font-family: var(--font-family-heading);
      margin: 0;
      font-size: 15px;
      font-weight: var(--font-weight-medium);
    }

    &__legend {
      ${utilityPrimary}
      font-size: 13px;
      margin-block-end: 18px;
    }

    &__button {
      ${buttonUnstyled}
      ${utilityPrimary}
      width: 100%;
      min-height: 48px;
      padding: 12px 10px 10px;
      font-size: 13px;
      background-color: var(--box-medium-bg-color);
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      &:hover:not(:disabled):not([aria-disabled="true"]),
      &.focus-visible {
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-interaction-light);
        outline: 0;
      }

      &.focus-visible {
        ${defaultFocusStyle}
        outline-offset: -2px;
      }

      &:disabled {
        color: ${transparentize("neutral75", 0.5)};
        cursor: default;
      }
    }
  }
`;
