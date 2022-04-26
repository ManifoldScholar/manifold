import { respond, fluidScale, defaultFocusStyle } from "theme/styles/mixins";

export default `
  .color-picker {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    align-items: center;
    justify-content: space-between;
    padding: 15px;

    &::after {
      font-family: var(--font-family-sans);
      position: absolute;
      top: calc(100% - 13px);
      left: calc(50% - 25px);
      z-index: 1;
      width: 50px;
      height: 26px;
      font-size: 14px;
      font-weight: var(--font-weight-semibold);
      line-height: 26px;
      color: var(--color-neutral-text-extra-light);
      text-transform: uppercase;
      letter-spacing: 0.107em;
      content: 'Or';
      background-color: var(--color-base-neutral90);

      ${respond(
        `
          top: calc(50% - 50px);
          right: -13px;
          left: auto;
          width: 26px;
          height: 100px;
          line-height: 100px;
        `,
        95
      )}
    }

    &__inner {
      display: flex;
    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: ${fluidScale("138px", "83px")};
    }

    &__item {
      position: relative;
      display: block;
      width: 38px;
      height: 38px;
      margin-bottom: 13px;
      cursor: pointer;

      & + & {
        margin-top: 0;
      }

      &--primary {
        background: var(--color-accent-primary-extra-pale);
      }

      &--secondary {
        background: var(--color-base-neutral10);
      }

      &--tertiary {
        background: var(--color-base-blue20);
      }

      &--quaternary {
        background: var(--color-base-orange20);
      }

      &--quinary {
        background: var(--color-base-violet20);
      }

      &--sentary {
        background: var(--color-base-neutral-white);
      }
    }

    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;

      &.focus-visible ~ .color-picker__indicator {
        ${defaultFocusStyle}
        outline-color: var(--focus-color);
        outline-offset: 3px;
      }
    }

    &__indicator {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: transparent;

      &::before {
        display: none;
      }

      .color-picker__item--checked & {
        background-color: transparent;
      }
    }

    &__indicator-icon {
      display: inline-block;
      color: var(--color-neutral-text-dark);
    }

    &__description {
      max-width: 150px;
      margin-top: 6px;
      font-size: ${fluidScale("12px", "10px")};
      font-family: var(--font-family-sans);
      font-weight: 600;
      line-height: 1.533em;
      text-transform: uppercase;
      letter-spacing: 0.125em;
    }
  }
`;
