import {
  clearfix,
  respond,
  defaultTransitionProps,
  utilityPrimary
} from "theme/styles/mixins";

export default `
  .section-pagination {
    ${clearfix()}
    background-color: var(--color-base-neutral05);
    transition: background-color ${defaultTransitionProps};

    .scheme-dark & {
      background-color: var(--color-base-neutral85);
    }

    &__inner {
      display: flex;
      justify-content: space-between;
      flexwrap: wrap;
    }

    &__link {
      ${utilityPrimary}
      display: inline-flex;
      flex-grow: 1;
      align-items: center;
      padding: 20px 0;
      font-size: 14px;
      text-decoration: none;
      vertical-align: middle;

      ${respond(`padding: 28px 0;`, 40)}
      ${respond(`padding: 26px 0;`, 75)}

      &--next {
        justify-content: flex-end;
      }
    }

    &__text {
      line-height: 1;
    }

    &__icon {
      &--previous {
        margin-right: 16px;
      }

      &--next {
        margin-left: 16px;
      }
    }
  }
`;
