import { setHoverStyle, defaultFocusStyle, respond } from "theme/styles/mixins";

export default `
  .checkbox {
    ${setHoverStyle()}
    position: relative;
    display: block;
    cursor: pointer;

    &--white {
      &:hover {
        color: var(--strong-color);
      }
    }

    ${respond(`display: inline-block;`, 20)}

    ${respond(
      `
        & + & {
          margin-left: 32px;
        }
      `,
      50
    )}

  + .instructions {
      display: inline-block;
    }

    &__indicator {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 12px;
      text-align: center;
      vertical-align: middle;
      background-color: var(--color-base-neutral-white);
      border-radius: 3px;

      .checkbox--gray & {
        background-color: var(--color-base-neutral20);
      }
    }

    &__icon {
      position: relative;
      top: 1px;
      color: var(--color-base-neutral-white);
      visibility: hidden;

      .checkbox--gray &,
      .checkbox--white & {
        color: var(--color-base-neutral90);
      }

      .checkbox.checked & {
        visibility: visible;
      }
    }

    input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }

    input:checked ~ .checkbox__indicator {
      background-color: var(--highlight-color);

      .checkbox__icon {
        visibility: visible;
      }
    }

    &--gray {
      input:checked ~ .checkbox__indicator {
        background-color: var(--color-base-neutral20);
      }
    }

    &--white {
      input:checked ~ .checkbox__indicator {
        background-color: var(--color-base-neutral-white);
      }
    }

    input:focus-visible {
      outline: 0;

      ~ .checkbox__indicator {
        ${defaultFocusStyle}
      }
    }
  }

  .checkbox-wrapper {
    &--inline {
      display: inline;
    }
  }
`;