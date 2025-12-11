import { utilityPrimary } from "theme/styles/mixins";

export default `
  .analytics-chart {
    font-size: 12px;
    font-weight: var(--font-weight-semibold);

    &__label {
      ${utilityPrimary}
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      letter-spacing: 0.1em;
    }

    &__tooltip {
      font-family: var(--font-family-sans);
      padding: 15px 18px;
      background-color: var(--color-base-neutral110);
      border: none;
      border-radius: 8px;
    }

    &__tooltip-label {
      ${utilityPrimary}
      display: block;
      font-size: 14px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-base-neutral50);
      letter-spacing: 0.1em;
    }

    &__tooltip-value {
      display: block;
      margin-top: 6px;
      font-size: 17px;
      color: var(--color-accent-secondary);
    }
  }
`;
