import {
  containerPrototype,
  headingTertiary,
  utilityPrimary,
  buttonUnstyled,
  respond,
  fluidScale
} from "theme/styles/mixins";

export default `
  .notification {
    --color: var(--color-neutral-text-extra-dark);

    width: 100%;
    color: var(--color);

    &--notice {
      background-color: var(--color-notification-notice-light);
    }

    &--warning {
      background-color: var(--color-notification-warning-light);
    }

    &--error {
      background-color: var(--color-notification-error-light);
    }

    &--context-drawer {
      background-color: var(--color-base-neutral90);
    }

    &__container {
      ${containerPrototype}
      position: relative;
      padding-top: 23px;
      padding-bottom: 25px;

      ${respond(
        `
        max-width: calc(var(--container-width-full) - 50px);
        padding: 23px 26px 25px;
      `,
        120
      )}

      .notification--context-drawer & {
        padding: 18px;
      }
    }

    &__heading {
      ${headingTertiary}
      padding-right: 67px;
      margin: 0;
      font-size: ${fluidScale("20px", "18px")};
      font-weight: var(--font-weight-semibold);

      .notification--context-drawer & {
        font-size: 20px;
        color: var(--color-base-neutral30);
      }
    }

    &__body {
      font-family: var(--font-family-copy);
      padding-right: 67px;
      margin-top: 10px;
      font-size: 16px;

      ${respond(`font-size: 20px;`, 70)}

      .notification--context-drawer & {
        ${headingTertiary}
        padding-right: 0;
        margin-top: 8px;
        font-size: 16px;
        font-weight: normal;
        color: var(--color-base-neutral30);
      }
    }

    &__button {
      ${buttonUnstyled}

      .notification--context-header & {
        position: absolute;
        top: 50%;
        right: var(--container-padding-inline-responsive);
        transform: translateY(-50%);

        ${respond(`right: 26px;`, 120)}

        &.focus-visible {
          outline-color: var(--color-base-neutral90);
        }

        &:hover {
          color: inherit;
        }
      }

      .notification--context-drawer & {
        position: relative;
        top: auto;
        right: auto;
        margin: 8px 0 0;
        font-size: inherit;
        color: var(--color-base-neutral50);

        &:hover {
          color: var(--color-base-neutral20);
        }

        .screen-reader-text {
          ${utilityPrimary}
          position: relative;
          margin: 0;
          overflow: visible;
          font-size: 12px;
        }
      }
    }

    &__button-icon {
      .notification--context-drawer & {
        display: none;
      }
    }
  }
`;
