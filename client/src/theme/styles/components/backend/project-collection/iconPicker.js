import { defaultTransitionProps } from "theme/styles/mixins";

export default `
  .icon-picker {
    &.form-input .form-input-heading {
      padding-bottom: 1em;
    }

    &__list {
      display: flex;
      flex-flow: row wrap;
      align-content: center;
      padding: 0;
    }

    &__item {
      /* need to use !important until form inputs are refactored due to specificity of selectors :( */
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin-top: -1px !important;
      margin-bottom: 0 !important;
      margin-left: -1px;
      cursor: pointer;
      border: 1px solid var(--color-neutral-ui-dull-light);
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      &--active,
      &:hover,
      &:focus-within {
        color: var(--color-base-neutral110);
        background-color: var(--focus-color);
        outline: 0;
      }
    }

    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }
  }
`;
