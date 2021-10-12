import {
  respond,
  defaultTransitionProps,
  defaultHoverStyle
} from "theme/styles/mixins";

export default `
  .resource-total {
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 40px;
    text-align: center;

    &--left-aligned {
      text-align: left;
    }

    &:not(:last-child) {
      margin-bottom: 25px;

      ${respond(`margin-bottom: 50px;`, 60)}
    }

    &--tight:not(:last-child) {
      ${respond(`margin-bottom: 15px;`, 60)}
    }

    &__link {
      font-family: var(--font-family-heading);
      font-size: 20px;
      text-decoration: none;

      &:hover {
        .resource-total__value {
          ${defaultHoverStyle}
          transition: color ${defaultTransitionProps};
        }
      }
    }

    &__value {
      color: var(--color-neutral-text-extra-dark);
    }

    &__icon {
      margin-bottom: 2px;
      margin-left: 15px;
    }
  }
`;
