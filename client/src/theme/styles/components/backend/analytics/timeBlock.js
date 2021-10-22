import { utilityPrimary } from "theme/styles/mixins";

export default `
  .analytics-time-block {
    display: inline-grid;
    grid-template:
      "min-val divider sec-val" auto
      "min-label . sec-label" auto / auto auto auto;
    row-gap: 18px;
    column-gap: 6px;
    text-align: center;

    &__value {
      font-size: 66px;
      font-weight: var(--font-weight-light);
      line-height: 1;
      color: var(--color-accent-secondary);

      &--minute {
        grid-area: min-val;
      }

      &--second {
        grid-area: sec-val;
      }
    }

    &__label {
      ${utilityPrimary}
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-base-neutral50);
      letter-spacing: 0.1em;

      &--minute {
        grid-area: min-label;
      }

      &--second {
        grid-area: sec-label;
      }
    }

    &__divider {
      grid-area: divider;
      font-size: 66px;
      font-weight: var(--font-weight-light);
      line-height: 1;
    }
  }
`;
