import {
  listUnstyled,
  buttonUnstyled,
  respond,
  defaultHoverStyle,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
  .reader-return-menu {
    max-width: 330px;
    background-color: var(--color-base-neutral10);

    ${respond(`max-width: 390px;`, 60)}

    &__list {
      ${listUnstyled}
      min-width: 260px;
    }

    &__item {
      & + & {
        border-top: 2px solid var(--color-base-neutral30);
      }
    }

    &__link {
      ${buttonUnstyled}
      font-family: var(--font-family-heading);
      display: block;
      width: 100%;
      padding: 16px 20px;
      font-size: 18px;
      text-align: left;
      text-decoration: none;
      letter-spacing: 0.004em;

      ${respond(
        `padding: 17px 26px;
      font-size: 22px;`,
        60
      )}

      &:focus-visible {
        ${defaultHoverStyle}
        outline: 0;
      }

      &--flush-bottom {
        padding-bottom: 0.38em;
      }
    }

    &__link-icon,
    &__logo-icon,
    &__link-text,
    &__small-text {
      transition: color ${defaultTransitionProps};

      .reader-return-menu__link:hover &,
      .reader-return-menu__link:focus-visible & {
        ${defaultHoverStyle}
      }
    }

    &__link-icon {
      margin-right: 14px;

      ${respond(
        `  width: 45.538px;
        height: 45.538px;
        margin-right: 16px;`,
        60
      )}
    }

    &__link-text {
      position: relative;
      top: 1px;
    }

    &__logo-icon {
      width: 28px;
      height: 28px;
      margin-right: 19px;
      margin-left: 4px;

      ${respond(
        `width: 34px;
      height: 34px;
      margin-right: 22px;
      margin-left: 5px;`,
        60
      )}
    }

    &__small-text {
      display: block;
      padding-bottom: 10px;
      padding-left: 51px;
      font-size: 17px;
      hyphens: none;
      text-decoration: underline;

      ${respond(`padding-left: 61px;`, 60)}
    }

    &__note {
      font-family: var(--font-family-heading);
      display: block;
      padding: 0.5em 1.688em 1.75em 24.5px;
      font-size: 16px;
      line-height: 1.5;
      text-decoration: underline;
      transition: color ${defaultTransitionProps};

      &:hover,
      &:focus-visible {
        ${defaultHoverStyle}
      }

      ${respond(`padding-left: 32px;`, 60)}
    }

    &__note-bold {
      display: inline;
      padding-left: 0;
      transition: color ${defaultTransitionProps};

      .reader-return-menu__note:hover &,
      .reader-return-menu__note:focus-visible & {
        color: var(--hover-color);
      }
    }
  }
`;
