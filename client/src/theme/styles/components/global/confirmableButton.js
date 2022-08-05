import {
  listUnstyled,
  buttonUnstyled,
  utilityPrimary,
  defaultHoverStyle
} from "theme/styles/mixins";

export default `
  .confirmable-button {
    &__confirm-list {
      ${listUnstyled}
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    &__button {
      ${buttonUnstyled}
      ${utilityPrimary}
      font-size: 12px;

      &--delete:not([aria-disabled="true"]):hover {
        ${defaultHoverStyle}
      }

      &--confirm {
        margin-top: 5px;
      }

      &--deny {
        margin-top: 5px;

        &:hover,
        &.focus-visible {
          color: var(--error-color);
        }
      }

      &[aria-disabled="true"]:hover {
        cursor: default;
        color: inherit;
      }
    }
  }
`;
