import {
  respond,
  breakpointLessOne,
  formInstructions,
  buttonUnstyled,
  draggable,
  dragging,
  textTruncate,
  setHoverStyle
} from "theme/styles/mixins";

const ITEM_INNER_PADDING = 10;

export default `
  .project-collection-list {
    margin-top: -5px;

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

      ul {
        max-height: 1150px;
        overflow-y: auto;
      }
    }

    .actions {
      margin-top: 18px;
      margin-bottom: 18px;
      margin-left: 0;

      ${respond(
        `
          margin-top: 37px;
          margin-bottom: 25px;
        `,
        75
      )}

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

        &.focus-visible {
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

        &.focus-visible {
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
    }

    &__icon-group-item {
      padding-right: 3px;
      padding-left: 3px;
    }
  }
`;
