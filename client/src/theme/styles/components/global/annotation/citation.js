import {
  utilityPrimary,
  defaultFocusStyle,
  formInputMessage,
  formInputPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
  .citation {
    padding-top: 28px;

    &__radios {
      display: block;
      padding: 0;
      margin: 0;
      color: var(--color-base-neutral50);
      border: none;
    }

    &__legend {
      ${utilityPrimary}
      margin-bottom: 15px;
      font-size: 14px;
    }

    &__radio {
      ${utilityPrimary}
      position: relative;
      font-size: 14px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: color ${defaultTransitionProps},
        border-color ${defaultTransitionProps};

      &:hover,
      &--active {
        color: var(--color-base-neutral-black);
        border-color: var(--color-base-neutral-black);
      }

      & + & {
        margin-left: 24px;
      }
    }

    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;

      &.focus-visible ~ .citation__label {
        ${defaultFocusStyle}
        outline-offset: 4px;
      }
    }

    &__notice {
      ${formInputMessage}
      color: var(--error-color);
    }

    &__copyable {
      ${formInputPrimary}
      width: 100%;
      padding: 1.2em 1.5em;
      margin-top: 32px;
      margin-bottom: 20px;
      color: var(--color-base-neutral90);
      background-color: var(--color-base-neutral10);
      border-radius: var(--box-border-radius);
    }
  }
`;
