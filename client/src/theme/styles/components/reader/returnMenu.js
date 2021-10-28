import {
  listUnstyled,
  buttonUnstyled,
  fluidScale,
  defaultHoverStyle,
  defaultTransitionProps,
  rgba
} from "theme/styles/mixins";

export default `
  .reader-return-menu {
    max-width: ${fluidScale("390px", "330px")};
    background-color: var(--box-bg-color);
    box-shadow: 0 12px 22px -3px ${rgba("neutralBlack", 0.13)};

    &__list {
      ${listUnstyled}
      min-width: 260px;
    }

    &__item {
      & + & {
        border-top: 2px solid var(--box-x-strong-bg-color);
      }
    }

    &__link {
      ${buttonUnstyled}
      font-family: var(--font-family-heading);
      display: block;
      width: 100%;
      padding: 16px ${fluidScale("26px", "20px")};
      font-size: ${fluidScale("22px", "18px")};
      text-align: left;
      text-decoration: none;
      letter-spacing: 0.004em;

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
      width: ${fluidScale("36px", "45px")};
      height: ${fluidScale("36px", "45px")};
      margin-right: ${fluidScale("16px", "14px")};
    }

    &__link-text {
      position: relative;
      top: 1px;
    }

    &__logo-icon {
      width: ${fluidScale("34px", "28px")};
      height: ${fluidScale("34px", "28px")};
      margin-right: ${fluidScale("22px", "19px")};
      margin-left: 5px;
    }

    &__small-text {
      display: block;
      padding-bottom: 10px;
      padding-left: ${fluidScale("61px", "51px")};
      font-size: 17px;
      hyphens: none;
      text-decoration: underline;
    }

    &__note {
      font-family: var(--font-family-heading);
      display: block;
      padding: 0.5em 1.688em 1.75em ${fluidScale("32px", "24px")};
      font-size: 16px;
      line-height: 1.5;
      text-decoration: underline;
      transition: color ${defaultTransitionProps};

      &:hover,
      &:focus-visible {
        ${defaultHoverStyle}
      }
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
