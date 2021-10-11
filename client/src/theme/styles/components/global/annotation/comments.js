import {
  drawerIndent,
  listHorizontal,
  buttonUnstyled,
  utilityPrimary,
  defaultHoverStyle
} from "theme/styles/mixins";

export default `
  .annotation-comments,
  .annotation-reply {
    &__body {
      ${drawerIndent("padding-left")}
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-regular);
      line-height: 1.375;
      color: var(--strong-color);
    }

    &__utility {
      margin-top: 10px;
    }

    &__utility-list {
      ${listHorizontal}
      ${drawerIndent("padding-left")}
      display: flex;
      flex-wrap: wrap;
      color: var(--medium-color);

      > li:not(:last-child) {
        margin-right: 26px;
      }
    }

    &__inline-list-button {
      ${buttonUnstyled}
      ${utilityPrimary}
      font-size: 12px;

      &--active {
        margin-bottom: 15px;
      }

      &--active {
        ${defaultHoverStyle}
      }

      &--secondary {
        color: var(--error-color);

        &--active,
        &:focus-visible {
          color: var(--error-color);
        }
      }
    }

    &__thread-container {
      &:focus {
        outline: none;
      }
    }
  }
`;
