import { panelRounded, respond, fluidScale } from "theme/styles/mixins";

export default `
  .ingest-header {
    ${panelRounded}

    &__inner {
      padding: calc(var(--container-padding-inline-narrow) * 0.6)
        calc(var(--container-padding-inline-narrow) * 0.75);
      margin-right: auto;
      margin-left: auto;

      ${respond(
        `padding: calc(var(--container-padding-inline-narrow) * 0.8) calc(var(--container-padding-inline-narrow) * 1.2);`,
        60
      )}

      &--padded {
        ${respond(
          `padding: var(--container-padding-inline-narrow) var(--container-padding-inline-responsive);`,
          35
        )}

        ${respond(
          `
        padding-right: var(--container-padding-inline-full);
        padding-left: var(--container-padding-inline-full);
      `,
          120
        )}
      }
    }

    &__content-flex-wrapper {
      display: flex;
      align-items: center;

      &--aib {
        align-items: baseline;
      }

      > * + * {
        margin-left: 8px;

        ${respond(`margin-left: 20px;`, 60)}
      }

      &--tight {
        > * + * {
          margin-left: 5px;
        }
      }
    }

    &__figure-block {
      &--shift-left {
        margin-left: -14px;
      }
    }

    &__body {
      margin-top: 20px;
    }

    &__title {
      margin: 0;
      font-size: ${fluidScale("22px", "16px")};
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-medium);
      hyphens: none;
      color: var(--color-base-neutral20);
    }

    &__type-icon {
      width: ${fluidScale("64px", "59px")};
      height: ${fluidScale("64px", "59px")};
    }
  }
`;
