import { listUnstyled, utilityPrimary, respond } from "theme/styles/mixins";

export default `
  .resource-variant-list {
    ${listUnstyled}
    ${utilityPrimary}
    display: none;
    font-size: 13px;

    ${respond(`display: block;`, 65)}

    .resource-variants-mobile & {
      display: block;
      margin-bottom: 25px;

      ${respond(`display: none;`, 65)}
    }

    &__section-title {
      margin-bottom: 10px;
    }

    &__list {
      ${listUnstyled}
    }

    &__item {
      white-space: nowrap;

      & + & {
        margin-top: 10px;
      }
    }

    &__link {
      display: inline-flex;
      align-items: center;
      color: var(--color-neutral-text-extra-dark);
      text-decoration: none;
    }

    &__link-text {
      white-space: pre-wrap;
    }

    &__link-icon {
      position: relative;
      top: 1px;
      margin-right: 6px;
      margin-left: -1px;
      color: var(--hover-color);
    }
  }
`;
