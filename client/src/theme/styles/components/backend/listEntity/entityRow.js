import {
  respond,
  draggable,
  dragging,
  defaultHoverStyle,
  buttonUnstyled,
  panelRounded,
  rgba,
  blockLabelRound,
  breakpointLessOne
} from "theme/styles/mixins";

export default `
  .entity-row {
    list-style: none;
    user-select: none;

    &__inner {
      position: relative;
      display: flex;
      align-items: flex-start;
      padding: 14px 19px 14px 0;
      border-bottom: 1px solid var(--color-neutral-ui-dull-light);
      transition: background-color var(--transition-duration-default) ease-out,
        box-shadow var(--transition-duration-default) ease-out;

      &--in-grid {
        ${respond(
          `
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding: 20px 25px;
          border-bottom: 0;
        `,
          65
        )}
      }

      &--in-well {
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        padding: 5px 10px;
        margin: 10px 10px 0 0;
        line-height: 1;
        border: 1px solid var(--color-neutral-ui-light);
        border-radius: 5px;

        &:last-child {
          padding-bottom: 5px;
        }
      }

      &--sortable {
        ${draggable}
        padding: 14px 9px 14px 11px;
        border-bottom: none;

        ${respond(`padding: 10px 19px 10px 23px;`, 90)}

        &.entity-row__inner--sortable-with-handle {
          cursor: default;
        }

        &.entity-row__inner--sortable-tight {
          padding: 14px 9px 14px 11px;
          background-color: var(--color-base-neutral90);
          border-bottom: 1px solid var(--color-neutral-ui-dull-light);
          border-radius: 0;
          transition: background-color var(--transition-duration-default)
            ease-out;

          .drawer--backend & {
            background-color: inherit;
          }
        }

        .show-dropzone & {
          border-bottom: 1px solid var(--color-base-neutral85);
          border-radius: 9px;
        }

        &.entity-row__inner--is-dragging {
          box-shadow: none;
        }
      }

      &--is-dragging {
        ${dragging}
      }

      .entity-row__row-link--is-active & {
        background-color: var(--color-base-neutral100);
        border-color: var(--color-base-neutral100);
        box-shadow: -21px 0 0 1px var(--color-base-neutral100),
          21px 0 0 1px var(--color-base-neutral100);
      }
    }

    &__row-link--button {
      ${buttonUnstyled}
      width: 100%;
      text-align: left;
    }

    &__drag-container {
      padding-top: 9px;
      padding-bottom: 9px;

      &.focus-visible {
        outline: 0;
      }
    }

    &__row-link {
      &:hover {
        color: var(--color-neutral-text-light);
      }
    }

    &__row-link--block {
      display: block;
      height: 100%;
      text-decoration: none;

      &.entity-row__row-link--in-grid {
        transition: background-color var(--transition-duration-default) ease-out,
          box-shadow var(--transition-duration-default) ease-out;

        &:hover,
        &.focus-visible {
          outline: 0;

          ${respond(
            `
              ${panelRounded}
              color: inherit;
              box-shadow: 0 31px 26px -13px ${rgba("neutralBlack", 0.33)};
            `,
            65
          )}
        }
      }
    }

    &__text {
      flex-grow: 1;
      align-self: flex-start;
      font-size: 17px;
      font-family: var(--font-family-serif);
      font-weight: var(--font-weight-regular);
      hyphens: none;

      a {
        text-decoration: none;

        &:hover {
          color: inherit;
          text-decoration-line: underline;
        }
      }

      a.entity-row__link {
        &--inverted {
          text-decoration-line: underline;

          &:hover {
            ${defaultHoverStyle}
          }
        }
      }

      &--valign-center {
        position: relative;
        top: -2px;
        align-self: center;
      }
    }

    &__labels {
      display: inline-block;
      margin: 0;
    }

    &__title--in-grid {
      .entity-row__labels {
        display: block;
      }
    }

    &__label {
      ${blockLabelRound}
      position: relative;
      display: inline-block;
      padding: 0.333em 5px;
      margin: -3px 0 0;
      font-size: 9px;
      line-height: 1.2em;
      color: var(--color-neutral-text-extra-dark);
      vertical-align: middle;
      background-color: var(--color-neutral-text-extra-light);

      &--notice {
        background-color: var(--color-notification-notice-light);
      }

      &--warning {
        background-color: var(--color-notification-warning-light);
      }

      &--error {
        background-color: var(--color-notification-error-light);
      }

      + .entity-row__label {
        margin-left: 14px;
      }
    }

    &__utility {
      align-self: center;
      flex-shrink: 0;
      margin-inline-start: auto;
    }

    &__utility-button {
      ${buttonUnstyled}

      &.entity-row__utility-button--handle {
        cursor: move;
        cursor: grab;
      }
    }

    &__figure {
      position: relative;
      align-self: flex-start;
      margin-top: 4px;
      margin-right: 18px;

      button {
        ${buttonUnstyled}
      }

      &--valign-center {
        align-self: center;
        margin-top: 0;
      }

      &--size-normal {
        width: 50px;

        img {
          width: 50px;
          height: auto;
        }

        &.entity-row__figure--shape-round {
          height: 50px;

          img {
            height: 50px;
          }
        }

        svg:not(.collecting-toggle__icon) {
          position: relative;
          top: -4px;
          left: -4px;
          width: 55px;
          height: 55px;

          &.project-thumb-placeholder {
            top: 0;
            left: 0;
            width: 50px;
            height: 50px;
            overflow: visible;
          }

          &.svg-icon--resourceImage64 {
            top: -10px;
          }

          &.svg-icon--resourceAudio64 {
            top: -7px;
          }

          &.svg-icon--resourceCollection64 {
            top: -10px;
            left: -4px;
            width: 58px;
            height: 58px;
          }
        }
      }

      &--size-small {
        width: 25px;
        margin-right: 14px;

        img {
          width: 25px;
        }

        &.entity-row__figure--shape-round {
          height: 25px;

          img {
            height: 25px;
          }
        }

        svg {
          position: relative;
          top: -3px;
          left: -3px;
          width: 30px;
          height: 30px;
        }
      }

      &--shape-round {
        img,
        svg {
          border-radius: 50%;
        }
      }

      &--in-grid {
        ${respond(
          `
          margin-bottom: 14px;

          img,
          svg:not(.collecting-toggle__icon) {
            left: 0;
            width: auto;
            max-width: none;
            height: 120px;

            &.project-thumb-placeholder {
              top: 0;
              left: 0;
              width: 110px;
              height: 110px;
              overflow: visible;
            }
          }
        `,
          65
        )}
      }

      .entity-row__figure--size-normal {
        width: auto;
      }
    }

    &__title {
      font-family: var(--font-family-sans);
      display: inline-block;
      align-items: center;
      margin: -1px 14px 0 0;
      font-size: 18px;
      font-weight: var(--font-weight-medium);
      line-height: 1.4em;
      color: var(--color-neutral-text-extra-light);

      /* in grids, labels are on a new line. */
      &--in-grid {
        margin-right: 0;

        .entity-row__title-inner {
          margin-right: 0;
        }
      }

      &--in-well {
        margin-right: 0;
        font-weight: 400;
      }

      button {
        ${buttonUnstyled}
      }

      ${respond(
        `&--in-grid {
      font-size: 16px;
    }`,
        65
      )}
    }

    &__title-inner {
      display: inline-block;
      margin-right: 14px;

      span {
        display: inline; /* needed for text-decoration: underline to work. */
      }

      .entity-row__row-link--block:not(.entity-row__row-link--in-grid):not(.entity-row__row-link--is-active):hover
        &,
      .entity-row__row-link--block:not(.entity-row__row-link--in-grid):not(.entity-row__row-link--is-active).focus-visible
        & {
        text-decoration-line: underline;
      }

      .entity-row__row-link--in-grid:hover &,
      .entity-row__row-link--in-grid.focus-visible & {
        ${respond(
          `text-decoration-line: underline;`,
          breakpointLessOne(65),
          "max"
        )}
      }

      .entity-row__row-link--is-active & {
        color: var(--color-accent-primary);
      }
    }

    &__count {
      font-family: var(--font-family-sans);
      margin: 0;
      font-size: 14px;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    &__subtitle {
      margin: 0;
      font-size: 18px;
      font-style: italic;
      font-weight: var(--font-weight-regular);

      ${respond(
        `&--in-grid {
      font-size: 16px;
    }`,
        65
      )}
    }

    &__meta {
      margin: 0;
      font-size: 17px;
      font-weight: var(--font-weight-regular);

      ${respond(
        `&--in-grid {
      font-size: 16px;
    }`,
        65
      )}

      em {
        font-style: normal;
      }
    }

    .entity-row__title + .entity-row__subtitle,
    .entity-row__title + .entity-row__meta,
    .entity-row__title + .entity-row__count,
    .entity-row__subtitle + .entity-row__count,
    .entity-row__subtitle + .entity-row__meta,
    .entity-row__count + .entity-row__meta {
      margin-top: 7px;
    }
  }

  /* A hack to adjust the drag container in tight, sortable entity lists. */
  .entity-list__list--sortable-tight .entity-row__drag-container {
    padding: 0;
  }

  /* Bit of a hack to clear out the hover state on other items when the list is sortable and an entity is being dragged. */
  .entity-list--dragging .entity-row__row-link--in-grid {
    &:hover {
      background-color: inherit;
      border-radius: 0;
      box-shadow: none;
    }
  }
`;
