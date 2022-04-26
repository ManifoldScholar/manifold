import { buttonUnstyled, listUnstyled } from "theme/styles/mixins";

const BUTTON_PADDING_LATERAL = 8;
const ICON_SIZE = 16;
const BUTTON_WIDTH = ICON_SIZE + BUTTON_PADDING_LATERAL * 2;

export default `
  .picker-input {
    position: relative;

    &__input-wrapper {
      position: relative;

      body.backend & {
        background-color: var(--color-base-neutral90);
      }
    }

    &__input {
      border: 1px solid var(--color-base-neutral70);
    }

    &__text-input {
      &--padded-1x {
        padding-right: ${BUTTON_WIDTH + BUTTON_PADDING_LATERAL}px !important;
      }

      &--padded-2x {
        padding-right: ${BUTTON_WIDTH * 2 +
          BUTTON_PADDING_LATERAL}px !important;
      }
    }

    &__button-group {
      position: absolute;
      top: 50%;
      right: ${BUTTON_PADDING_LATERAL}px;
      display: flex;
      pointer-events: none;
      transform: translateY(-50%);
    }

    &__button {
      ${buttonUnstyled}
      padding: ${BUTTON_PADDING_LATERAL}px 6px;
      color: var(--color-accent-primary);
    }

    &__icon {
      &--reset {
        pointer-events: all;
      }

      &--disclosure {
        pointer-events: none;
      }
    }

    &__results {
      ${listUnstyled}
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      max-height: 210px;
      padding: 8px 0;
      overflow: auto;
      color: var(--color-base-neutral10);
      visibility: hidden;
      background-color: var(--color-base-neutral90);
      border-color: var(--color-base-neutral80);
      border-style: solid;
      border-width: 0 1px 1px;
      opacity: 0;
      transition: opacity var(--transition-duration-fast) var(--transition-timing-function), visibility var(--transition-duration-fast) var(--transition-timing-function);

      .picker-input--open & {
        visibility: visible;
        opacity: 1;
      }
    }

    &__result {
      padding: 8px 17px;
      font-family: var(--font-family-sans);
      color: var(--color-base-neutral10);
      cursor: pointer;

      & + & {
        border: 0;
      }

      &:hover,
      &--active {
        background: var(--color-base-neutral80);
      }

      &--active.picker-input__result--selected {
        background: var(--color-base-neutral75);
      }

      &--selected {
        background: var(--color-base-neutral85);
      }

      &--empty {
        color: var(--color-base-neutral45);
        cursor: inherit;

        &:hover {
          background: inherit;
        }
      }
    }

    .form-secondary .form-input & {
      input[type="text"] {
        height: auto;
        padding: 8px 0 13px 17px;
        border: 0;

        &.focus-visible {
          border: 0;
        }

        &::placeholder {
          color: var(--color-base-neutral10);
        }
      }
    }

    &__utility {
      margin-top: 12px;
      margin-bottom: 8px;
    }

    &__list {
      margin-top: 24px;

      &--tight {
        margin-top: 0;
      }
    }
  }
`;
