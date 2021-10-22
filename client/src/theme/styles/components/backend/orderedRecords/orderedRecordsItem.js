import {
  defaultTransitionProps,
  dragging,
  subtitlePrimary,
  utilityPrimary,
  buttonUnstyled
} from "theme/styles/mixins";

export default `
  .ordered-records-item {
    font-family: var(--font-family-sans);
    transition: border ${defaultTransitionProps};

    & + & {
      border-top: 1px solid var(--color-neutral-ui-dull-light);
    }

    &--is-dragging {
      ${dragging}
      border: none;
    }

    &--is-dragging ~ &,
    & ~ &--is-dragging {
      border: none;
    }

    &__inner {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      margin: 0 -16px;
      background: var(--color-base-neutral90);
      border: 1px solid var(--color-base-neutral90);
      border-radius: 8px;
    }

    &--placeholder {
      position: absolute;
      width: 100%;
      padding-right: 38px;
      background: none;
    }

    &__details {
      display: flex;
      flex-direction: row;
      text-decoration: none;

      &:hover {
        color: inherit;
      }
    }

    &__title-wrapper {
      padding-left: 16px;
    }

    &__title {
      margin: 0 0 0.6em;
      font-size: 17px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-neutral-text-extra-light);
      transition: color ${defaultTransitionProps};
    }

    &__subtitle {
      ${subtitlePrimary}
      margin-top: 7px;
      margin-left: 7px;
      text-transform: none;
      transition: color ${defaultTransitionProps};
    }

    &__date {
      ${utilityPrimary}
      display: inline-block;
      font-size: 12px;
      font-weight: var(--font-weight-medium);
    }

    &__icon {
      svg {
        width: 50px;
        height: 50px;
      }
    }

    &__utility {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;

      > * + * {
        margin-left: 14px;
      }
    }

    &__button {
      ${buttonUnstyled}
      display: block;
      padding: 0;

      &--notice {
        &:hover {
          color: var(--error-color);
        }
      }
    }
  }
`;
