import {
  utilityPrimary,
  listUnstyled,
  buttonUnstyled
} from "theme/styles/mixins";

export default `
  .share-nav-primary {
    display: flex;
    align-items: center;

    &__label {
      ${utilityPrimary}
      margin-right: 8px;
      font-size: 14px;
      line-height: 15px;
    }

    &__list {
      ${listUnstyled}
      display: flex;
      align-items: center;
    }

    &__link {
      ${buttonUnstyled}
      padding-right: 8px;
      padding-left: 8px;
      color: var(--color-neutral-ui-dark);
      text-decoration: none;
    }
  }
`;
