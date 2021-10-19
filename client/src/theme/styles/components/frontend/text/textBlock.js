import {
  respond,
  defaultTransitionProps,
  utilityPrimary,
  listUnstyled
} from "theme/styles/mixins";

export default `
  .text-block {
    display: flex;
    flex-direction: column;

    ${respond(`flex-direction: row;`, 60)}

    &--loading {
      --strong-color: var(--color-base-neutral30);

      svg {
        color: var(--color-base-neutral40);
      }
    }

    a {
      &:focus-visible {
        outline: 0;
      }
    }

    &__content {
      display: flex;
      flex-grow: 1;
      padding: 0;
      color: inherit;
      text-decoration: none;
    }

    &__inner {
      display: flex;
      width: 100%;
      padding: 0;
    }

    &__cover {
      position: relative;
      display: none;
      padding-top: 0;
      margin-bottom: 0;
      line-height: 1;

      ${respond(`display: block;`, 60)}

      &--image {
        min-width: 56px;
        max-width: 56px;
        height: auto;
        margin-right: 17px;
      }

      &--svg {
        margin-right: 5px;
        margin-left: -10px;
        color: var(--content-color, var(--color-neutral-ui-dull-dark));
        transition: color ${defaultTransitionProps};
      }
    }

    &__cover-image {
      width: 56px;
      height: auto;
      border: 1px solid transparent;
      transition: border ${defaultTransitionProps};
    }

    &__bibliographic {
      display: flex;
      flex-flow: column;
      flex-grow: 1;
      width: 100%;
      padding-right: 20px;
      padding-left: 15px;
      hyphens: none;
      vertical-align: top;
    }

    &__name {
      display: flex;
      margin: 0;
      font-size: 16px;
      font-weight: var(--font-weight-semibold);
      line-height: 1.188;
      color: var(--strong-color);
      white-space: normal;
      transition: color ${defaultTransitionProps};

      ${respond(`font-size: 21px;`, 80)}
    }

    &__title-link {
      text-decoration: none;
    }

    &__title {
      font-family: var(--font-family-heading);
      display: inline-block;
      margin-right: 12px;
    }

    &__subtitle,
    &__creators {
      font-family: var(--font-family-copy);
      display: block;
      padding-top: 6px;
      font-size: 15px;

      ${respond(`font-size: 18px;`, 80)}
    }

    &__subtitle {
      margin-right: 12px;
      font-style: italic;
      font-weight: var(--font-weight-regular);
      letter-spacing: 0.031em;
      transition: color ${defaultTransitionProps};

      ${respond(
        `display: inline-block;
      padding-top: 0.143em;`,
        80
      )}
    }

    &__collect-toggle {
      flex-grow: 1;
      transform: translateY(-0.238em);

      &--with-subtitle {
        transform: translateY(-0.19em);
      }
    }

    &__creators {
      line-height: 1.25;
      color: var(--color-neutral-text-extra-dark);

      ${respond(`padding-top: 0.6em;`, 80)}
    }

    &__description {
      font-family: var(--font-family-copy);
      max-width: 635px;
      margin-top: 15px;
      font-size: 16px;
      line-height: 1.438;
      letter-spacing: 0.013em;
    }

    &__meta {
      flex-shrink: 0;
      min-width: 288px;
      padding-right: 20px;
      padding-left: 15px;
      margin-top: 20px;

      ${respond(
        `
          padding-right: 0;
          padding-left: 0;
          margin-top: 4px;
          text-align: right;
        `,
        60
      )}
    }

    &__status {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      > :not(:first-child) {
        margin-top: 12px;
      }

      &--block {
        margin-top: 12px;
      }

      &--inline {
        ${respond(
          `flex-direction: row;
        align-items: baseline;
        justify-content: flex-end;

          > :not(:first-child) {
              margin-top: 0;
              margin-left: 12px;
            }
        `,
          60
        )}
      }
    }

    &__date {
      ${utilityPrimary}
      display: block;
      font-size: 12px;
      letter-spacing: 0.107em;

      ${respond(`font-size: 14px;`, 68)}
    }

    &__published {
      font-family: var(--font-family-heading);
      display: inline-block;
      padding: 4px 7px 6px;
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      line-height: 1;
      color: var(--strong-color);
      text-transform: uppercase;
      letter-spacing: 0.134em;
      vertical-align: middle;
      background-color: var(--accent-primary);
      border-radius: 3px;

      ${respond(`font-size: 13px;`, 80)}
    }

    &__interaction-list {
      ${listUnstyled}
      display: flex;
      flex-direction: row;
      align-items: center;

      &:not(:first-child) {
        padding-top: 15px;
      }

      ${respond(`justify-content: flex-end;`, 60)}
    }

    &__interaction {
      ${utilityPrimary}
      font-size: 14px;
      letter-spacing: 0.107em;
      border-bottom: none;

      & + & {
        margin-left: 13px;
      }
    }

    &__interaction-icon {
      margin-right: 6px;
    }

    &__interaction-label {
      color: var(--strong-color);
    }
  }
`;
