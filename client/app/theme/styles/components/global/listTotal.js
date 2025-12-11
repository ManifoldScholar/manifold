import { utilityPrimary, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .list-total {
    ${utilityPrimary}
    font-size: 13px;
    color: var(--color);
    transition: color ${defaultTransitionProps};

    &--extra-bottom {
      margin-bottom: 20px;
    }

    &--empty {
      padding-top: 20px;
      border-bottom: 0;
    }

    &__highlighted {
      color: var(--strong-color);
    }

    .section-heading-secondary & {
      float: right;
    }

    .section-heading-secondary a:hover & {
      color: var(--hover-color);
    }
  }
`;
