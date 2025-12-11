import { defaultTransitionProps } from "theme/styles/mixins";

export default `
  .icon-picker {
    &__list {
      display: flex;
      flex-flow: row wrap;
      align-content: center;
      padding: 0;
    }

    &__item {
      /* need to use !important until form inputs are refactored due to specificity of selectors :( */
      position: relative;
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin-top: -1px !important;
      margin-bottom: 0 !important;
      margin-left: -1px;
      border: 1px solid var(--color-neutral-ui-dull-light);
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};
      position: relative;

      &--active,
      &:hover {
        color: var(--color-base-neutral110);
        background-color: var(--focus-color);
        outline: 0;
      }

      &:focus-within {
        color: var(--color-base-neutral110);
        background-color: var(--color-accent-primary-pale);
        border-color: var(--color-accent-primary-pale);
      }
    }

    &__input {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 10;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
`;
