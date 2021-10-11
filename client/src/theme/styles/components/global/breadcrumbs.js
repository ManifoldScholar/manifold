import { respond, utilityPrimary } from "theme/styles/mixins";

export default `
  .breadcrumbs {
    ${utilityPrimary}
    display: block;
    padding: 0.5em 1em 0.6em;
    font-size: 16px;
    line-height: 1.4;
    text-decoration: none;
    text-transform: none;
    letter-spacing: 0;
    background-color: var(--color-base-neutral100);

    ${respond(
      `
      padding-top: 0.45em;
      padding-bottom: 0.5em;
      font-size: 20px;
    `,
      50
    )}

    &--hidden-desktop {
      ${respond(`display: none;`, 75)}
    }

    &__inner {
      display: flex;
      align-items: center;
    }

    &__link {
      text-decoration: none;
    }

    &__icon {
      position: relative;
      top: -0.045em;
      margin-right: 0.5em;

      &--small {
        ${respond(`display: none;`, 50)}
      }

      &--large {
        display: none;

        ${respond(`display: inline-block;`, 50)}
      }
    }
  }
`;
