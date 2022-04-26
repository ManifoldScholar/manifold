import { containerWidth } from "theme/styles/variables/layout";
import {
  respond,
  defaultTransitionProps,
  formLabelPrimary,
  screenReaderText,
  blockLabelRound,
  utilityPrimary,
  listUnstyled,
  defaultFocusStyle,
  textTruncate
} from "theme/styles/mixins";

const FULL_CONTAINER_WIDTH = parseInt(containerWidth.full, 10);
const LAYOUT_BREAKPOINT = 65;
const CELL_PADDING_VERTICAL = "16px";
const CELL_PADDING_LATERAL_STATIC = 30;
const CELL_PADDING_LATERAL_RESPONSIVE = `${(CELL_PADDING_LATERAL_STATIC /
  FULL_CONTAINER_WIDTH) *
  100}vw`;
const CELL_PADDING_LATERAL = `min(${CELL_PADDING_LATERAL_STATIC}px, ${CELL_PADDING_LATERAL_RESPONSIVE})`;

export default `
  .table {
    &__responsive-container {
      overflow: auto;
    }

    &__heading-small {
      ${formLabelPrimary}
    }

    &__row {
      position: relative;
      padding: 16px;
      margin: 0;
      border-bottom: 1px solid var(--color-base-neutral45);
      transition: background-color ${defaultTransitionProps};

      &--is-link {
        cursor: pointer;

        &.table__row--is-hovering {
          background-color: var(--box-bg-color);
        }
      }
    }

    &__list {
      display: grid;

      ${respond(screenReaderText, LAYOUT_BREAKPOINT)}
    }

    &__list-item-container {
      padding-bottom: 15px;
    }

    &__list-value {
      padding-top: 3px;
      margin-top: 0;
    }

    &__table {
      display: none;
      width: 100%;

      ${respond(`display: table;`, LAYOUT_BREAKPOINT)}
    }

    &__th {
      padding: ${CELL_PADDING_VERTICAL} ${CELL_PADDING_LATERAL};
      text-align: left;
    }

    &__ordered-list {
      ${listUnstyled}

      ${respond(`display: none;`, LAYOUT_BREAKPOINT)}
    }

    &__link-arrow {
      flex-shrink: 0;
      opacity: 0;
      transition: opacity ${defaultTransitionProps},
        transform ${defaultTransitionProps};
      transform: translateY(1px);

      &--active {
        opacity: 1;
        transform: translate(20%, 1px);
      }

      &:not(:first-child) {
        margin-left: 12px;
      }

      .table__avatar--placeholder ~ & {
        transform: translateY(0);

        &--active {
          transform: translateX(20%);
        }
      }
    }

    &__private-icon {
      position: relative;
      top: -2.5px;
      margin-left: 10px;
      color: var(--color-neutral-ui-dark);
    }

    &__nested-link {
      position: relative;
      padding: 4px 32px 5px 17px;
      margin-left: -17px;
      text-decoration: none;
      border-radius: 13px;
      transition: background-color ${defaultTransitionProps};

      &:hover,
      &.focus-visible {
        color: inherit;
        background-color: var(--box-bg-color);

        .table__nested-link-arrow {
          opacity: 1;
          transform: translate(20%, -50%);
        }
      }
    }

    &__nested-link-arrow {
      position: absolute;
      top: 50%;
      right: 12px;
      opacity: 0;
      transition: opacity ${defaultTransitionProps},
        transform ${defaultTransitionProps};
      transform: translate(0, -50%);
    }

    &__name {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      padding-bottom: 3px;
      margin-top: -6px;
      margin-left: -12px;
      text-decoration: none;

      ${respond(`width: auto;`, LAYOUT_BREAKPOINT)}

      &--with-link {
        &:hover,
        &.focus-visible {
          outline: 0;
        }
      }

      .table__avatar ~ & {
        padding-bottom: 0;
      }

      > * {
        margin-top: 6px;
        margin-left: 12px;
      }
    }

    &__sr-link {
      ${screenReaderText}

      &.focus-visible {
        outline: 0;

        ~ .table__name-container {
          ${defaultFocusStyle}
        }
      }
    }

    &__mobile-columns {
      display: flex;
      justify-content: space-between;

      ${respond(`justify-content: flex-start;`, 40)}
    }

    &__padded-cell {
      padding: ${CELL_PADDING_VERTICAL} ${CELL_PADDING_LATERAL};
    }

    &__row-link {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 100%;
    }

    &__body-text {
      font-family: var(--font-family-sans);
      position: relative;
      margin: 0;
      color: var(--strong-color);
    }

    &__value-large {
      display: inline-flex;
      align-items: center;
      padding: 10px 0 20px;
      margin: 0;
      font-size: 18px;
      font-weight: var(--font-weight-medium);

      ${respond(
        `
          width: 100%;
          min-width: 250px;
          padding: ${CELL_PADDING_VERTICAL} ${CELL_PADDING_LATERAL};
          font-size: 21px;
        `,
        LAYOUT_BREAKPOINT
      )}
    }

    &__inline-value {
      display: inline-block;

      &--underlined {
        line-height: 1.6;
      }

      &:not(:first-child) {
        margin-left: min(20px, ${(20 / FULL_CONTAINER_WIDTH) * 100}vw);
      }
    }

    &__inline-icon {
      position: relative;
      top: -1px;
      margin-right: 5px;
      color: var(--color);
    }

    &__name-container {
      ${textTruncate}
      line-height: 1.4;
      transform: translateY(1px);

      ${respond(
        `
          overflow: visible;
          line-height: inherit;
          white-space: normal;
        `,
        LAYOUT_BREAKPOINT
      )}
    }

    &__tag {
      ${blockLabelRound}
      display: inline-block;
      flex-shrink: 0;
      padding: 5px 12px 6px;
      font-size: 11px;
      line-height: 1.2em;
      color: var(--strong-color);
      white-space: nowrap;
      vertical-align: middle;
      background-color: var(--box-medium-bg-color);
      transform: translateY(3px);
    }

    &__actions {
      display: flex;

      > * + * {
        flex-shrink: 0;
        margin-left: 7px;
      }
    }

    &__no-left-padding {
      padding-left: 0;
    }

    &__grid-item-left {
      grid-column-start: 1;
    }

    &__grid-item-right {
      grid-column-start: 2;
    }

    &__grid-item-row-2 {
      grid-row-start: 2;
    }

    &__grid-item-row-3 {
      grid-row-start: 3;
    }

    &__grid-item-colspan {
      grid-column-end: span 2;
      min-width: 0;
    }

    &__value-standard {
      ${utilityPrimary}
      font-size: 12px;
    }

    &__centered {
      ${respond(`text-align: center;`, LAYOUT_BREAKPOINT)}
    }

    &__right {
      text-align: right;
    }

    &__cell {
      &--fit-content {
        ${respond(
          `
            width: 1%;
            white-space: nowrap;
          `,
          LAYOUT_BREAKPOINT
        )}
      }

      &--truncate {
        ${textTruncate}
      }

      &--header-has-icon {
        padding-left: 32px;

        ${respond(`padding-left: 20px;`, LAYOUT_BREAKPOINT)}
      }
    }

    &__small-padding-left {
      ${respond(`padding-left: 10px;`, LAYOUT_BREAKPOINT)}
    }

    &__right-unpadded {
      padding-right: 0;
      vertical-align: middle;
    }

    &__pagination:not(:empty) {
      padding-top: 30px;
    }

    &__avatar {
      flex-shrink: 0;

      &--image {
        width: 30px;
        height: 30px;
        margin: -1px 14px -1px 3px;
        border: 1px solid var(--color-base-neutral50);
        border-radius: 100%;
      }

      &--placeholder {
        margin: -3px 10px -4px 0;
        color: var(--color-base-neutral50);

        svg {
          width: 36px;
          height: 36px;
        }
      }

      + .table__name {
        transform: translateY(-2px);
      }
    }

    &__avatar-placeholder-container {
      width: 38px;
      margin-right: 8px;
      margin-left: -2px;
    }

    &__hide-desktop {
      ${respond(`display: none;`, LAYOUT_BREAKPOINT)}
    }

    &__hide-mobile {
      display: none;

      ${respond(`display: inline-block;`, LAYOUT_BREAKPOINT)}
    }
  }
`;
