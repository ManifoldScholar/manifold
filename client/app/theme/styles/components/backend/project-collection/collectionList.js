import {
  respond,
  breakpointLessOne,
  formInstructions,
  buttonUnstyled,
  draggable,
  dragging,
  textTruncate,
  setHoverStyle,
  revealOnFocus
} from "theme/styles/mixins";

const ITEM_INNER_PADDING = 10;

export default `
  .project-collection-list {
    &.aside-wide {
      display: block;

      ${respond(
        `
          width: 100%;
          margin-right: 0;
        `,
        breakpointLessOne(75),
        "max"
      )}
    }

    .entity-list {
      margin-top: -5px;
    }

    .actions {
      margin-block-end: clamp(18px, 3.333vw, 25px);
      margin-left: 0;

      &:not(:first-child) {
        margin-block-start: clamp(18px, 5vw, 25px);
      }

      ${respond(
        `
          display: flex;
          flex-wrap: nowrap;
        `,
        95
      )}
    }

    .instructional-copy {
      ${formInstructions}
    }
  }

  .project-collection-list-item {
    --PopoverMenu-inset-block-start: calc(100% + 10px);
    --PopoverMenu-inset-inline-end: -10px;

    padding-top: 5px;
    padding-bottom: 5px;

    &__inner {
      ${draggable}
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      &--is-dragging {
        ${dragging}
      }

      .project-collection-list-item--selected & {
        color: var(--color-base-neutral95);
        background-color: var(--color-accent-primary);
      }
    }

    &__link {
      ${buttonUnstyled}
      display: flex;
      flex-grow: 1;
      padding: ${ITEM_INNER_PADDING}px ${ITEM_INNER_PADDING}px
        ${ITEM_INNER_PADDING}px ${ITEM_INNER_PADDING * 2}px;
      overflow: hidden;
      text-align: left;

      .project-collection-list-item--selected & {
        &:hover {
          color: inherit;
        }

        &:focus-visible {
          color: inherit;
          outline-color: var(--color-neutral-ui-dark);
        }
      }
    }

    &__item-text,
    &__count {
      font-family: var(--font-family-sans);
      position: relative;
      top: -2px;
      font-size: 16px;
    }

    &__item-text {
      ${textTruncate}
      flex-grow: 1;
      padding: 3px 0;
      margin-right: 6px;
      text-align: left;
    }

    &__count {
      margin-right: 6px;
    }

    &__button {
      ${buttonUnstyled}

      &--drag-handle {
        cursor: grab;
        ${setHoverStyle()}
      }

      .project-collection-list-item--selected & {
        &:hover {
          color: inherit;
        }

        &:focus-visible {
          color: inherit;
          outline-color: var(--color-base-neutral70);
        }
      }
    }

    &__icon-group {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      padding: ${ITEM_INNER_PADDING}px;
      ${revealOnFocus(".project-collection-list-item__keyboard-buttons")}
    }

    &__icon-group-item {
      padding-right: 3px;
      padding-left: 3px;
    }
  }
`;
