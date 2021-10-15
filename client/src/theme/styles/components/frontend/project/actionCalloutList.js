import {
  respond,
  defaultHoverStyle,
  defaultTransitionProps,
  rgba
} from "theme/styles/mixins";

const calloutGutter = "19px";

export default `
  .action-callout-list {
    display: flex;
    flex-direction: column;
    width: 100%;

    > * {
      width: 100%;
      margin-top: ${calloutGutter};
    }

    &--inline {
      ${respond(
        `
          flex-flow: row wrap;
          margin-top: ${calloutGutter};
          margin-bottom: -${calloutGutter};
          margin-left: -${calloutGutter};

          > * {
            width: auto;
            margin-top: 0;
            margin-bottom: ${calloutGutter};
            margin-left: ${calloutGutter};
          }
        `,
        60
      )}
    }

    &__button,
    &__link {
      font-family: var(--font-family-heading);
      font-size: 13px;
      font-weight: var(--font-weight-semibold);
      color: inherit;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.104em;
    }

    &__button {
      display: grid;
      grid-template: ". icon text ." auto / 1fr auto auto 1fr;
      grid-gap: 9px;
      align-items: center;
      padding-right: 13px;
      padding-left: 13px;
      color: var(--color-neutral-text-extra-dark);
      border: 2px solid transparent;
      transition: background-color ${defaultTransitionProps},
        border-color ${defaultTransitionProps};

      &:focus-visible {
        outline: 0;
      }

      &--primary {
        background-color: var(--color-accent-primary);

        &:hover,
        &:focus-visible {
          color: var(--color-base-neutral90);
          background-color: var(--color-accent-primary-dull);
        }

        &:focus-visible {
          border-color: var(--color-accent-primary);
        }
      }

      &--secondary {
        background-color: var(--color-base-neutral30);

        &:hover {
          color: inherit;
          background-color: ${rgba("neutral30", 0.7)};
        }

        &:focus-visible {
          border-color: var(--color-base-neutral70);
        }

        .project-hero--dark & {
          color: $neutral95;
          background-color: var(--color-neutral-ui-light);
          border-color: var(--color-neutral-ui-light);

          &:hover,
          &:focus-visible {
            background-color: var(--color-base-neutral30);
            border-color: var(--color-base-neutral30);
          }

          &:focus-visible {
            border-color: var(--color-base-neutral75);
          }
        }
      }

      &--error {
        background-color: var(--color-notification-warning-light);

        &:hover,
        &:focus-visible {
          color: var(--color-neutral-text-extra-dark);
          background-color: var(--color-notification-warning-extra-light);
        }
      }

      &--centered {
        grid-template: ". text ." auto / 1fr auto 1fr;
      }
    }

    &__button-icon {
      grid-area: icon;
      margin-left: -6px;

      .action-callout-list__button--secondary & {
        color: var(--color-neutral-text-extra-dark);
      }
    }

    &__button-text {
      display: block;
      grid-area: text;
      padding-top: 12px;
      padding-bottom: 12px;

      ${respond(
        `padding-top: 17px;
      padding-bottom: 17px;`,
        60
      )}
    }

    &__link {
      display: block;
      min-height: 17.33px;

      &:hover {
        .action-callout-list__link-icon {
          ${defaultHoverStyle}
        }
      }

      &--error {
        color: var(--color-notification-warning-light);

        &:hover,
        &:focus-visible {
          color: var(--color-notification-warning-extra-light);
        }
      }
    }

    &__link-icon {
      margin-right: 8px;
      color: $neutral50;
      transition: color ${defaultTransitionProps};

      .project-hero--dark & {
        color: var(--color-base-neutral45);
      }
    }
  }
`;
