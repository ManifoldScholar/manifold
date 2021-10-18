import { panelRounded, listUnstyled, respond } from "theme/styles/mixins";

export default `
  .text-list {
    &__category {
      &:not(:last-child) .text-list__item:last-child {
        border-color: transparent;
      }
    }

    &__category-heading {
      ${panelRounded}
      font-family: var(--font-family-heading);
      padding: 0.857em 1.643em 1em;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 13px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-neutral-text-extra-dark);
      text-transform: uppercase;
      letter-spacing: 0.107em;
      background-color: var(--color-base-neutral10);

      ${respond(`font-size: 14px;`, 80)}
    }

    &__list {
      ${listUnstyled}
      display: flex;
      flex-direction: column;

      &--no-label {
        border-top: 1px solid var(--color-neutral-ui-dull-dark);
      }
    }

    &__item {
      padding: 30px 0;
      border-bottom: 1px solid var(--color-neutral-ui-dull-dark);
    }
  }
`;
