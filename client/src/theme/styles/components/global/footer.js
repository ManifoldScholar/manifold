import {
  fluidScale,
  respond,
  clearfix,
  listUnstyled,
  defaultHoverStyle,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
  .app-footer {
    --hover-color: var(--color-interaction-light);
    --focus-color: var(--color-interaction-light);

    padding-top: ${fluidScale("67px", "32px")};
    color: var(--color-neutral-text-light);
    background-color: var(--color-base-neutral85);

    &--reader {
      padding-top: 0;
    }

    &--branded {
      .app-footer__column--right {
        display: none;
        ${respond(`display: block;`, 65)}
      }
    }

    &--standalone {
      --focus-color: var(--color-interaction-light);

      padding-top: 0;
    }

    &__columns {
      ${clearfix}

      margin-bottom: 30px;

      ${respond(`min-height: 105px;`, 65)}
    }

    &__row {
      display: flex;
      flex-direction: column-reverse;

      ${respond(
        `
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        `,
        65
      )}
    }

    &__socials {
      float: right;
      width: 200px;
      margin-top: 38px;
    }

    &__socials-list {
      ${listUnstyled}
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    &__socials-item {
      padding: 0;

      a:hover,
      a:focus-visible {
        outline: 0;

        svg {
          ${defaultHoverStyle}
        }
      }

      .svg-icon--socialTwitter32 {
        margin-left: 10px;
      }
    }

    &__column {
      &--right {

        padding-top: 30px;

        ${respond(
          `
            order: 2;
            padding-top: 0;
          `,
          65
        )}
      }

      &--left {
        ${respond(
          `
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 0;
          `,
          65
        )}
      }
    }

    &__copyright {
      position: relative;
      padding-bottom: 20px;
      font-size: 14px;
      font-family: var(--font-family-copy);

      ${respond(
        `
          padding-top: 8px;
          padding-bottom: 25px;
        `,
        30
      )}

      ${respond(`font-size: 16px;`, 40)}

      &--standalone {
        padding: 0;
      }

      &--with-top-margin {
        margin-top: 30px;

        ${respond(`padding-top: 67px;`, 65)}
      }

      a {
        color: inherit;
      }

    }


    &__press-logo {
      display: none;
      padding: 0;
      margin-bottom: 14px;

      ${respond(
        `
          display: inline-block;
          float: right;
          margin-bottom: 0;
        `,
        65
      )}
      }
    }

    &__press-logo-image {
      max-width: 328px;
      max-height: 202px;
    }

  }


  .app-footer-navigation {
    &--mobile {
      ${respond(`display: none;`, 85)}
    }

    &--desktop {
      display: none;

      ${respond(`display: block;`, 85)}
    }

    margin-top: -20px;
    margin-bottom: 20px;
    ${listUnstyled}
    font-size: 16px;

    ${respond(`margin-bottom: 0;`, 75)}

    &__list {
      ${listUnstyled}
      display: flex;
      flex-wrap: wrap;
    }

    &__group {
      ${listUnstyled}
      max-width: 150px;
      margin-right: 30px;
      margin-bottom: 0.8em;

      ${respond(
        `
          max-width: 160px;
          margin-right: 70px;
        `,
        90
      )}
    }

    &__item {
      + .app-footer-navigation__item {
        margin-top: 0.8em;
      }

      display: flex;
      font-size: 17px;
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-medium);
    }

    &__icon {
      position: relative;
      top: -1px;
      margin-right: 14px;
    }

    &__link {
      text-decoration: none;
      cursor: pointer;
    }
  }

  .app-footer-powered-by {
    display: block;
    padding-top: 30px;
    padding-bottom: 30px;
    background-color: var(--color-base-neutral90);
    transition: background-color ${defaultTransitionProps};

    &--reader {
      padding-top: 42px;
      padding-bottom: 42px;
    }

    &--with-hover {
      &:hover,
      &:focus-visible {
        background-color: var(--hover-color);
        outline: 0;

        .app-footer-powered-by__logo-icon,
        .app-footer-powered-by__logo-text--neutral,
        .app-footer-powered-by__logo-text--white {
          color: var(--color-neutral-text-extra-dark);
        }
      }
    }

    &__copyright {
      font-family: var(--font-family-copy);
      display: inline-block;
      margin-top: 10px;
      margin-left: 0;
      font-size: 15px;
      font-weight: normal;
      line-height: 1.4em;
      vertical-align: top;

      ${respond(
        `
          margin-top: -6px;
          margin-left: 6px;
          font-size: 17px;
        `,
        65
      )}
    }

    &__logo {
      display: block;
      font-size: 20px;
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-semibold);
      line-height: 33px;
      color: var(--color-base-neutral-white);
      text-decoration: none;

      &--dull {
        ${respond(`color: var(--color-base-neutral30);`, 65)}
      }

      &--w-copyright {
        display: flex;
        flex-direction: column;

        ${respond(`flex-direction: row;`, 65)}
      }

      &--with-hover {
        &:hover,
        &:focus-visible {
          outline: 0;

          .app-footer-powered-by__logo-icon,
          .app-footer-powered-by__logo-text--neutral,
          .app-footer-powered-by__logo-text--white {
            color: var(--color-base-neutral-white);
          }
        }
      }
    }

    &__logo-icon {
      position: relative;
      top: -2px;
      flex-shrink: 0;
      margin-right: 14px;
      color: var(--highlight-color);
      transition: color ${defaultTransitionProps};

      &--dull {
        ${respond(`color: var(--color-base-neutral70);`, 65)}
      }
    }

    &__logo-text {
      display: inline-block;

      &--tiny {
        margin-top: 11px;
        font-size: 12px;
        line-height: 1.4em;
        ${respond(
          `
            margin-top: 0;
            font-size: 13px;
          `,
          65
        )}
      }

      &--neutral {
        color: var(--color-neutral-text-light);
        transition: color ${defaultTransitionProps};
      }

      &--white {
        transition: color ${defaultTransitionProps};
      }
    }

    &__postscript {
      margin-top: 20px;
    }

  }


  .app-footer-search-form {
    input {
      border-width: 1px;
      border-radius: 8px;

      &:focus-visible {
        &::placeholder {
          color: var(--focus-color);
        }
      }
    }

    &--with-top-margin {
      margin-top: 30px;

      ${respond(`margin-top: 60px;`, 65)}
    }
  }
`;