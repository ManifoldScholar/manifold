import {
  panelRounded,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  lighten,
  dragging
} from "theme/styles/mixins";

export default `
  .action-callout-slot {
    display: flex;
    width: 100%;
    padding: 12px 0;

    &--active {
      .action-callout-slot__content {
        background-color: ${lighten("neutral90", 5)};
      }
    }

    &__content {
      ${panelRounded}
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      padding: 7px;
      background: var(--box-medium-bg-color);
      transition: background-color ${defaultTransitionProps};
    }

    &__button {
      ${buttonUnstyled}
      ${utilityPrimary}
      padding: 8px 0 8px 4px;
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-base-neutral45);
      text-align: left;
      transition: color ${defaultTransitionProps};

      &--header {
        display: flex;
        margin-bottom: 4px;
        line-height: 1.5em;

        svg {
          flex-shrink: 0;
          margin-right: 8px;
        }
      }

      &--draggable {
        display: inline-block;
        cursor: move; /* fallback for older browsers */
        cursor: grab;
        user-select: none;
        -webkit-touch-callout: none;
      }

      &.focus-visible {
        color: var(--color-accent-primary);
        outline: 0;
      }
    }

    &__chips {
      flex-grow: 1;
      width: 100%;
      padding: 0;
    }

    &__chip {
      padding: 5px 0;
    }

    &__chip-inner {
      ${utilityPrimary}
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding: 10px 15px;
      font-size: 12px;
      line-height: 1.2;
      color: var(--color-base-neutral50);
      letter-spacing: 0.125em;
      background: var(--color-base-neutral95);
      border-radius: 5px;

      .action-callout-slot__chip--is-dragging & {
        ${dragging}
      }
    }

    &__chip-title {
      display: -webkit-inline-box;
      flex-grow: 1;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    &__chip-utility {
      display: flex;
      align-self: flex-start;
      margin-top: -4px;
      margin-left: 10px;
    }
  }
`;
