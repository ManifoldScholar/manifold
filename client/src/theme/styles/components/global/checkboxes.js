import { setHoverStyle, defaultFocusStyle, respond } from "theme/styles/mixins";

export default `
  .checkbox {
    ${setHoverStyle()}
    position: relative;
    display: block;

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
      flex-shrink: 0;
      margin-right: 12px;
      text-align: center;
      vertical-align: middle;
      background-color: var(--color-base-neutral-white);
      border-radius: 3px;
      border: 1px solid var(--color-base-neutral90);

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

      .checkbox--white & {
        top: -1px;
      }

      .checkbox.checked & {
        visibility: visible;
      }
    }

    input {
      position: absolute;
      inset-inline-start: 0;
      inset-block-start: 0;
      inline-size: 100%;
      block-size: 100%;
      opacity: 0;
      cursor: pointer;
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

    input.focus-visible {
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
