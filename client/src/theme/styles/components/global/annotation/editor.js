import {
  drawerPadding,
  drawerIndent,
  respond,
  fluidScale,
  utilityPrimary,
  buttonUnstyled,
  defaultTransitionProps,
  screenReaderText,
  defaultFocusStyle
} from "theme/styles/mixins";

const ACTION_MARGIN_TOP = 18;
const BUTTON_MARGIN_LEFT = 15;

export default `
  .annotation-editor {
    ${drawerPadding("padding-right")}
    ${drawerPadding("padding-left")}
    padding-top: 32px;

    ${respond(`padding-top: 48px;`, 90)}

    .annotation-comments &,
    .resource-comments & {
      ${drawerIndent("padding-left")}
      padding-top: 5px;
      padding-right: 0;
      padding-bottom: 5px;
      margin-top: 10px;

      .annotation-editor__textarea {
        font-size: 16px;
      }
    }

    &__editor-label {
      ${utilityPrimary}
      display: flex;
      align-items: center;
      margin: 0;
      margin-bottom: 1.313em;
      font-size: ${fluidScale("16px", "14px")}
    }

    &__label-icon {
      margin-right: 7px;
      margin-left: -3px;
      color: var(--color-neutral-ui-dark);

      ${respond(
        `
          width: 54px;
          height: 54px;
          margin-right: 9px;
        `,
        60
      )}
    }

    &__textarea {
      width: 100%;
      padding: 1em 1.5em;
      font-size: ${fluidScale("20px", "16px")};
      font-family: var(--font-family-sans);
      color: var(--strong-color);
      resize: vertical;
      background-color: var(--box-medium-bg-color);
      border: 0;
      border-radius: var(--box-border-radius);

      &.focus-visible {
        ${defaultFocusStyle}
      }

      &::placeholder {
        color: var(--color);
      }

      &.focus-visible::placeholder {
        color: var(--strong-color);
      }
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      margin-top: ${10 - ACTION_MARGIN_TOP}px;

      ${respond(`margin-top: ${20 - ACTION_MARGIN_TOP}px;`, 90)}
    }

    &__action {
      display: flex;
      flex-direction: column;
      margin-top: ${ACTION_MARGIN_TOP}px;

      ${respond(
        `
          flex-direction: row;
          align-items: center;
        `,
        60
      )}
    }

    &__action-label {
      ${utilityPrimary}
      display: flex;
      align-items: center;
      margin-right: 16px;
      margin-bottom: 8px;
      font-size: 14px;
      letter-spacing: 0.125em;

      ${respond(`margin-bottom: 0;`, 60)}
    }

    &__action-icon {
      margin-right: 12px;
    }

    &__group-picker {
      position: relative;
      color: var(--strong-color);
    }

    &__group-select {
      ${screenReaderText}

      &.focus-visible ~ .annotation-editor__group-picker .annotation-editor__group-picker-toggle {
        ${defaultFocusStyle}
      }
    }

    &__group-picker-toggle {
      ${buttonUnstyled}
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 250px;
      padding: 7.5px 16px 9.5px 18px;
      font-size: 17px;
      font-family: var(--font-family-sans);
      background-color: var(--box-medium-bg-color);
      border-radius: 20px;
      transition: background-color ${defaultTransitionProps};

      &:hover {
        color: inherit;
        background-color: var(--box-strong-bg-color);
      }

      &.focus-visible {
        background-color: var(--box-strong-bg-color);
        outline: 0;
      }

      svg {
        position: relative;
        top: 2px;
        flex-shrink: 0;
        margin-left: 3px;
      }
    }

    &__group-picker-toggle-text {
      overflow: hidden;
      line-height: 1.4;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__buttons {
      display: flex;
      width: 100%;
      margin-top: ${ACTION_MARGIN_TOP}px;
      margin-left: -${BUTTON_MARGIN_LEFT}px;

      ${respond(`width: auto;`, 120)}

      &--end {
        width: auto;
      }

      &:only-child {
        justify-content: flex-end;
        width: 100%;
        margin-left: 0;
      }

      .button-primary, .button-secondary {
        min-width: 100px;
        padding: 9px 0 11px;
        margin-left: ${BUTTON_MARGIN_LEFT}px;
        font-size: 14px;
      }

      .button-secondary {
        color: var(--color-neutral-text-extra-dark);
        border-radius: var(--box-border-radius);

        &:disabled {
          color: var(--color-base-neutral75);
          background-color: var(--color-base-neutral05);
          cursor: default;
        }

        &:active:not(:disabled),
        &:hover:not(:disabled) {
          color: inherit;
        }
      }
    }

    .placeholder button {
      ${buttonUnstyled}
      ${utilityPrimary}
      font-size: 14px;
      border: 0;
    }
  }
`;
