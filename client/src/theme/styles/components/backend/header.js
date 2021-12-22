import { panelRounded, respond, fluidScale } from "theme/styles/mixins";

export default `
  .backend-header {
    ${panelRounded}

    &--spaceBottom {
      margin-bottom: 30px;
    }

    &__inner {
      padding: calc(var(--container-padding-narrow) * 0.6)
        calc(var(--container-padding-narrow) * 0.75);
      margin-right: auto;
      margin-left: auto;

      ${respond(
        `padding: calc(var(--container-padding-narrow) * 0.8) calc(var(--container-padding-narrow) * 1.2);`,
        60
      )}

      &--padded {
        ${respond(
          `padding: var(--container-padding-narrow) var(--container-padding-responsive);`,
          35
        )}

        ${respond(
          `
        padding-right: var(--container-padding-full);
        padding-left: var(--container-padding-full);
      `,
          120
        )}
      }

      &--empty {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 48px;
        padding-bottom: 48px;
      }
    }

    &__content-wrapper {
      display: grid;
      grid-template:
        "figure title" auto
        "figure utility" auto / auto 1fr;
      row-gap: 9px;
      column-gap: 25px;
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

    &__title-block {
      grid-area: title;
    }

    &__utility-block {
      grid-area: utility;

      &--flex {
        flex-grow: 1;
        text-align: right;
      }
    }

    &__figure-block {
      grid-area: figure;

      &--shift-left {
        margin-left: -14px;
      }
    }

    &__section-nav {
      display: block;
      border-radius: 0 0 var(--box-border-radius) var(--box-border-radius);

      &.open {
        border-radius: 0;
      }

      ul {
        border-radius: 0 0 var(--box-border-radius) var(--box-border-radius);
      }

      ${respond(`display: none;`, 65)}
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

    &__h2-title {
      position: relative;
      top: -1px;
      padding: 0.75em 1.5em 0.875em;
      margin: 0;
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      color: var(--color-accent-primary);
      letter-spacing: 0.143em;
    }

    &__subtitle {
      margin-left: 0.433em;
      font-size: 1.071em;
      font-family: var(--font-family-serif);
      color: var(--color-neutral-text-light);
    }

    &__emphasis {
      font-style: normal;
      color: var(--color-accent-primary);
    }

    &__empty-text {
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-semibold);
      text-align: center;
    }

    &__note {
      font-family: var(--font-family-serif);
      font-size: ${fluidScale("17px", "14px")};
      line-height: initial;
    }

    &__figure {
      &--rounded {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        width: ${fluidScale("60px", "50px")};
        height: ${fluidScale("60px", "50px")};
        background-color: var(--color-base-neutral90);
        border-radius: var(--box-border-radius);
      }

      &--accented {
        color: var(--color-accent-primary);
      }

      &--alt-accented {
        color: var(--color-accent-secondary);
      }
    }

    &__type-icon {
      width: ${fluidScale("64px", "59px")};
      height: ${fluidScale("64px", "59px")};

      &--project {
        margin-top: 4px;
      }

      &--small {
        width: ${fluidScale("34px", "26px")};
        height: ${fluidScale("34px", "26px")};
      }

      .backend-header__figure--rounded & {
        width: ${fluidScale("44px", "40px")};
        height: ${fluidScale("44px", "40px")};
      }
    }
  }
`;
