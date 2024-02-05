import {
  buttonUnstyled,
  utilityPrimary,
  respond,
  inputQuaternary
} from "theme/styles/mixins";

export default `
  .entity-list-search {
    --select-bg-color: var(--color-base-neutral90);

    &__keyword-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--color-neutral-ui-dull-light);
      border-radius: var(--box-border-radius);
    }

    &__search-button {
      ${buttonUnstyled}
      width: 20px;
      height: 20px;
      margin-top: -2px;
      margin-left: 14px;

      &.focus-visible {
        color: var(--color-accent-primary);
        outline: 0;
      }
    }

    &__text-button {
      ${buttonUnstyled}
      ${utilityPrimary}
      display: none;
      margin-right: 14px;
      font-size: 13px;
      letter-spacing: 2px;

      ${respond(`display: block;`, 60)}

      &--foregrounded {
        display: block;
      }

      &.focus-visible {
        color: var(--color-accent-primary-pale);
        outline: 0;
      }
    }

    &__keyword-input-wrapper {
      display: block;
      flex: 1;
      border-radius: 8px;
    }

    &__keyword-input {
      ${inputQuaternary}
      width: 100%;
      padding-left: 14px;
      border: 0;
      font-family: var(--font-family-sans);
    }

    &__options {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin: 0 -11px;
      padding-block-end: 1px;

      &--vertical {
        display: block;
        margin: 0;
        padding-block-start: 30px;
      }
    }

    &__option {
      flex: 0 0 100%;
      padding: 30px 11px 0;

      &--vertical {
        flex: none;
        padding: 0;

        .select__label {
          &--empty {
            display: block;
            padding-top: 0;
          }
          padding-top: 30px;
        }

        & + & {
          margin-block-start: 30px;
        }
      }

      ${respond(`flex: 0 0 33.333%;`, 60)}
    }
  }
`;
