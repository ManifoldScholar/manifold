import {
  respond,
  fluidScale,
  defaultHoverStyle,
  defaultTransitionProps,
  draggable,
  dragging,
  blockLabelRound,
  buttonUnstyled
} from "theme/styles/mixins";

export default `
  .backend-content-block {
    padding-top: 9px;
    padding-bottom: 9px;

    &--inactive {
      color: var(--color-neutral-ui-dull-light);
    }

    &--active {
      color: var(--color-neutral-text-light);
    }

    &--available {
      ~ [data-rbd-placeholder-context-id] {
        /* hide placeholder in Available dropzone since dropping is disabled */
        display: none !important;
      }
    }

    &__inner {
      ${draggable}
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 9px 14px 11px;
      color: inherit;
      border: 1px solid transparent;

      .backend-content-block--current & {
        padding-right: 12px;
        cursor: default;

        ${respond(`padding: 10px 19px 10px 23px;`, 90)}
      }

      .backend-content-block--is-dragging & {
        ${dragging}
      }

      .backend-content-block--inactive & {
        cursor: not-allowed;
      }

      &.focus-visible {
        border-color: var(--color-accent-primary);
        outline: 0;

        .backend-content-block--available.backend-content-block--active & {
          .backend-content-block__heading {
            color: var(--color-accent-primary);
          }
        }
      }
    }

    &__heading {
      display: grid;
      grid-template-columns: max-content auto;
      flex-grow: 1;
      align-items: center;
      color: var(--color-neutral-ui-light);
      transition: color ${defaultTransitionProps};

      .backend-content-block--active & {
        color: var(--color-neutral-text-extra-light);
      }

      .backend-content-block--active.backend-content-block--available &:hover {
        ${defaultHoverStyle}
      }
    }

    &__icon {
      &--large {
        width: ${fluidScale("46px", "36px")};
        height: ${fluidScale("46px", "36px")};
      }

      &--incomplete {
        color: var(--error-color);
      }
    }

    &__title {
      font-family: var(--font-family-sans);
      margin-left: 15px;
      font-size: 17px;
      font-weight: var(--font-weight-regular);

      &--small {
        margin-bottom: 3px;
      }

      &--large {
        margin-right: 8%;
        margin-bottom: 5px;
        font-weight: var(--font-weight-medium);

        ${respond(
          `
            margin-left: 23px;
            font-size: 20px;
          `,
          90
        )}
      }
    }

    &__label {
      ${blockLabelRound}
      position: relative;
      display: inline-block;
      padding: 0.333em 5px;
      margin: -2px 0 0 14px;
      font-size: 9px;
      line-height: 1.2em;
      color: var(--color-base-neutral85);
      vertical-align: middle;
      background-color: var(--color-base-neutral30);
    }

    &__button-list {
      display: flex;

      > * + * {
        margin-left: 2vw;

        ${respond(`margin-left: 14px;`, 60)}
      }
    }

    &__button {
      ${buttonUnstyled}

      &--delete {
        --hover-color: var(--error-color);
      }

      &--draggable {
        cursor: move; /* fallback for older browsers */
        cursor: grab;
        user-select: none;
        -webkit-touch-callout: none;
      }

      &:disabled {
        cursor: not-allowed;

        &:hover {
          color: inherit;
        }
      }
    }
  }
`;
