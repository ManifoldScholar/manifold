import {
  respond,
  listUnstyled,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

const GRID_GAP = "15px";

export default `
  .resource-kind-picker {
    padding-bottom: 40px;

    ${respond(`padding-bottom: 12px;`, 65)}

    &__list {
      ${listUnstyled}
      display: none;
      flex-wrap: wrap;
      margin-left: calc(-1 * ${GRID_GAP});

      ${respond(`display: flex;`, 65)}
    }

    &__item {
      ${buttonUnstyled}
      display: flex;
      flex-basis: calc(50% - ${GRID_GAP});
      flex-direction: column;
      align-items: center;
      padding: 18px 10px;
      margin-bottom: ${GRID_GAP};
      margin-left: ${GRID_GAP};
      border: 1px solid var(--color-neutral-ui-dull-light);
      transition: background-color var(--transition-duration-fast)
          var(--transition-timing-function),
        border-color ${defaultTransitionProps};

      ${respond(`flex-basis: calc(25% - ${GRID_GAP});`, 60)}

      ${respond(`flex-basis: calc(20% - ${GRID_GAP});`, 80)}

    &--active {
        color: var(--color-neutral-text-extra-light);
        background-color: var(--color-base-neutral80);
        border-color: var(--color-base-neutral80);
      }

      &:hover,
      &:focus-within {
        border-color: var(--hover-color);
        outline: 0;
      }
    }

    &__label {
      font-family: var(--font-family-sans);
      padding-bottom: 18px;
      font-size: 14px;
      font-weight: var(--font-weight-medium);
      line-height: 1.2;
      text-decoration: none;
      text-transform: uppercase;
    }

    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }

    &__select {
      ${respond(`display: none;`, 65)}

      &--only {
        display: block;

        ${respond(`padding-bottom: 28px;`, 65)}
      }
    }
  }
`;