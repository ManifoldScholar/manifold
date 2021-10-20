import { defaultTransitionProps } from "theme/styles/mixins";

export default `
  .notation-marker {
    color: var(--color-neutral-ui-dark);
    transition: color ${defaultTransitionProps};

    .scheme-dark & {
      color: var(--color-neutral-ui-light);
    }

    &--active {
      color: var(--hover-color);

      .scheme-dark & {
        color: var(--hover-color);
      }
    }

    &__icon {
      position: relative;
      top: -1px;
      color: inherit;
    }
  }
`;
