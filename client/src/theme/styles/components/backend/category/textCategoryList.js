import {
  dragging,
  panelRounded,
  utilityPrimary,
  buttonUnstyled,
  lighten
} from "theme/styles/mixins";

export default `
  .text-categories {
    &__category {
      ${panelRounded}
      margin-bottom: 16px;
      background: var(--color-base-neutral95);

      &--is-dragging {
        ${dragging}
      }
    }

    &__header {
      ${utilityPrimary}
      display: flex;
      justify-content: space-between;
      padding: 8px 24px;
      font-size: 14px;
      font-weight: var(--font-weight-medium);
      line-height: 1;
      color: var(--color-neutral-text-extra-light);
      background: var(--color-base-neutral100);
      border-radius: 8px 8px 0 0;
    }

    &__label {
      margin: 4px 0;
      font-size: 14px;
      hyphens: none;
      line-height: 1.3em;

      &--notice {
        color: var(--error-color);
      }
    }

    &__label-type {
      &--light {
        color: var(--color-neutral-text-light);
      }
    }

    &__utility {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 14px;

      > * + * {
        margin-left: 14px;
      }
    }

    &__button {
      ${buttonUnstyled}
      display: inline;
      padding: 0;
      color: var(--color-neutral-text-light);

      &--notice {
        &:hover {
          color: var(--error-color);
        }
      }
    }

    &__dropzone {
      ${panelRounded}
      padding: 16px 16px 4px;
      margin-right: -16px;
      margin-bottom: 16px;
      margin-left: -16px;
      background-color: transparent;
      transition: background-color 0.4s ease;

      &--active {
        background-color: ${lighten("neutral90", 3)};
      }
    }
  }
`;
