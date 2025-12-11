import { defaultTransitionProps, utilityPrimary } from "theme/styles/mixins";

export default `
  .section-category-label {
    --labelBgColor: var(--color-base-yellow20);

    position: sticky;
    bottom: 0;
    padding: 20px 0 18px;
    text-align: center;
    background-color: var(--labelBgColor);
    transition: background-color ${defaultTransitionProps};

    .scheme-dark & {
      background-color: var(--color-neutral-text-dark);
    }

    &__label {
      ${utilityPrimary}
      display: inline-block;
      padding: 0.786em 0.8em;
      font-size: 14px;
      font-weight: var(--font-weight-light);
      color: var(--color-neutral-text-extra-dark);
      border: 1px solid;
      transition: color ${defaultTransitionProps};

      .scheme-dark & {
        color: var(--color-neutral-text-extra-light);
      }
    }
  }
`;
