import {
  respond,
  fluidScale,
  buttonUnstyled,
  listUnstyled,
  utilityPrimary
} from "theme/styles/mixins";

export default `
  .search-query {
    --hover-color: var(--color-interaction-dark);

    color: var(--color-neutral-text-dark);

    &__input {
      width: 100%;
      padding: 0.722em 0.889em;
      font-size: ${fluidScale("18px", "16px")};
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-regular);
      color: var(--strong-color) !important;
      background-color: var(--color-base-neutral05);
      border: 2px solid var(--box-color);
      outline: none;
      appearance: none;

      &::placeholder {
        color: var(--color);
      }

      &.focus-visible {
        outline: 0;

        &::placeholder {
          color: var(--strong-color);
        }
      }

      .search-menu & {
        --strong-color: var(--color-neutral-text-extra-dark);

        background-color: var(--color-base-neutral-white);
      }
    }

    &__input-magnify {
      position: relative;
      width: 100%;

      ${respond(`min-width: 380px;`, 40)}

      .search-query__input {
        padding-left: 56px;
        border-radius: 8px;
      }
    }

    &__submit {
      ${buttonUnstyled}
      position: absolute;
      top: 50%;
      left: 20px;
      line-height: 0;
      transform: translateY(-47%);
    }

    &__filter-group {
      padding: 0;
      margin: 0;
      margin-top: 36px;
      border: none;

      &--inline {
        display: flex;
        flex-wrap: wrap;
      }

      & + & {
        margin-top: 22px;
      }
    }

    &__filter-group-list {
      ${listUnstyled}
      display: flex;
      flex-wrap: wrap;
      row-gap: 12px;

      > *:not(:last-child) {
        margin-right: 36px;

        ${respond(`margin-right: 30px;`, 70)}
      }
    }

    &__group-label {
      ${utilityPrimary}
      position: relative;
      display: block;
      padding-top: 2px;
      margin-top:  0;
      margin-right: 30px;
      margin-bottom: 18px;
      font-size: 13px;
    }

    &__checkbox,
    .form-toggle.radio .toggle-label {
      ${utilityPrimary}
      font-size: 13px;
    }

    &__checkbox,
    .form-toggle.radio {
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: ${fluidScale("14px", "10px")};

      ${respond(`width: auto;`, 50)}

      & + & {
        margin-left: 0;
      }
    }

    .form-toggle.radio + .radio {
      margin-top: 0;
      margin-left: 0;
    }

    & + .search-query__filters {
      padding-top: 40px;
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      padding-top: 11px;
    }

    &__description {
      font-size: 14px;
      font-family: var(--font-family-copy);
      font-style: italic;
    }

    &__button-primary {
      font-size: 15px;
    }
  }

`;
