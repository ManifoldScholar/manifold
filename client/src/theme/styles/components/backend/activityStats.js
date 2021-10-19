import { respond } from "theme/styles/mixins";

export default `
  .backend-activity-stats {
    &__list {
      padding: 0;
      margin: 0;
    }

    &__list-item {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding: 6px 0 8px;
      border-bottom: 1px solid var(--color-neutral-ui-dull-light);

      &:first-child {
        padding-top: 0;
      }

      ${respond(`padding: 11px 0 6px;`, 40)}
    }

    &__list-text {
      font-family: var(--font-family-sans);
      font-size: 15px;
      letter-spacing: 0.015em;

      ${respond(`font-size: 18px;`, 40)}

      &--highlighted {
        font-family: var(--font-family-sans);
        font-size: 24px;
        color: var(--color-accent-primary);

        ${respond(`font-size: 27px;`, 40)}
      }
    }
  }
`;
