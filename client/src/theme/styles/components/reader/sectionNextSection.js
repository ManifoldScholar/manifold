import {
  defaultTransitionProps,
  fluidScale,
  respond,
  utilityPrimary,
  defaultHoverStyle
} from "theme/styles/mixins";

export default `
  .section-next-section {
    transition: background-color ${defaultTransitionProps};

    .scheme-dark & {
      background-color: var(--color-base-neutral90);
    }

    &__container {
      padding-block-start: ${fluidScale("64px", "0px")};
      padding-block-end: ${fluidScale("130px", "50px")};
    }

    &__link {
      display: inline-block;
      text-decoration: none;
    }

    &__header {
      ${utilityPrimary}
      display: inline-block;
      padding-bottom: 5px;
      font-size: 14px;
      border-bottom: 2px solid var(--color-base-neutral40);
    }

    &__title {
      font-family: var(--font-family-heading);
      margin-top: 1.192em;
      margin-bottom: 1em;
      font-size: 24px;
      font-weight: var(--font-weight-semibold);
      hyphens: none;
      color: var(--color-neutral-text-extra-dark);
      transition: color ${defaultTransitionProps};

      ${respond(`font-size: 26px;`, 70)}

      .scheme-dark & {
        color: var(--color-neutral-text-extra-light);
      }

      .section-next-section__link:hover &,
      .section-next-section__link.focus-visible & {
        ${defaultHoverStyle}
      }
    }
  }
`;
