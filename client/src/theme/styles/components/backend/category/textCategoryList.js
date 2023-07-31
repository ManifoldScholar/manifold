import {
  dragging,
  panelRounded,
  utilityPrimary,
  buttonUnstyled,
  lighten,
  respond,
  fluidScale
} from "theme/styles/mixins";

export default `
  .text-categories {
    padding-block-start: 16px;

    &__category {
      ${panelRounded}
      margin-bottom: 16px;
      background: var(--color-base-neutral95);

      &--is-dragging {
        ${dragging}
      }
    }

    &__uncategorized {
      &:first-child {
        margin-block-start: 16px;
      }
    }

    &__header {
      ${utilityPrimary}
      display: flex;
      justify-content: space-between;
      padding: 8px ${fluidScale("24px", "20px")};
      font-size: 14px;
      font-weight: var(--font-weight-medium);
      line-height: 1;
      color: var(--color-neutral-text-extra-light);
      background: var(--color-base-neutral100);
      border-radius: 8px 8px 0 0;

      *[role="tooltip"] {
        text-transform: none;
      }
    }

    &__label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 4px 0;
      font-size: 14px;
      hyphens: none;
      line-height: 1.3em;

      ${respond(`flex-direction: row;`, 85)}

      &--notice {
        color: var(--error-color);
      }

      &--tooltip {
        cursor: pointer;
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
