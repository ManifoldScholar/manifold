import {
  utilityPrimary,
  setHoverStyle,
  defaultTransitionProps,
  formLabelPrimary,
  formInstructions,
  formInputSecondary,
  roundedFormHeader,
  textTruncate,
  unstyledSelect,
  respond
} from "theme/styles/mixins";

const FORM_SELECT_ICON_SIZE = 24;
const FORM_SELECT_ICON_PADDING = 12;
const FORM_SELECT_INLINE_END_PADDING =
  FORM_SELECT_ICON_SIZE + 2 * FORM_SELECT_ICON_PADDING;

export default `
  .form-section .form-input-group > .form-input .form-select--rounded .form-select {
    width: auto;
  }

  .form-secondary {
    .drawer-primary & {
      margin-bottom: 80px;
    }

    & :is(.form-section, .form-input) + :is(.form-section, .form-input) {
      margin-top: 20px;

      ${respond(`margin-top: 40px;`, 60)}
    }

    .form-header {
      ${roundedFormHeader}

      ${respond(`margin-bottom: 38px;`, 90)}
    }

    .instructions {
      ${formInstructions}
      display: block;
      margin-top: 0.75em;

      &--inline {
        display: inline;
      }

      + .form-input-group--primary {
        margin-top: 32px;
      }

      + .form-input-group--secondary {
        margin-top: 24px;
      }

      a, a:visited {
        color: inherit;
      }
    }

    .notification {
      font-family: var(--font-family-copy);
      display: block;
      margin-top: 0.75em;
      font-size: 17px;
      font-style: italic;
      color: var(--highlight-color);
      text-align: right;
      text-transform: none;
    }

    .form-input {
      .form-input-heading, .column-heading, label:not(.checkbox):not(.radio):not(.toggle):not(.icon-picker):not(.form-switch) {
        ${formLabelPrimary}
        display: block;
        margin-top: 0;
        margin-bottom: 0.5em;

        &.below {
          margin-top: 0.6em;
          margin-bottom: 0;
        }

        &.secondary {
          font-weight: normal;
        }

        &.toggle {
          margin-bottom: 1em;
        }

        &.pad-bottom {
          margin-bottom: 1em;
        }
      }

      input[type='text'], input[type='email'], input[type='password'], input[type='number'] {
        ${formInputSecondary}
        transition: border-color ${defaultTransitionProps};

        &:focus-visible {
          border-color: var(--focus-color);
        }
      }

      textarea {
        width: 100%;
        padding: 1.2em;
        font-family: var(--input-font-family);
        font-size: 16px;
        resize: vertical;
        background-color: var(--input-bg-color);
        border: 1px solid var(--input-border-color);
        border-radius: var(--box-border-radius);
        outline: none;
        transition: border-color ${defaultTransitionProps};

        ${respond(
          `
            padding: 1.25em 1.389em;
            font-size: 18px;
          `,
          70
        )}

        &::placeholder {
          color: var(--color-neutral-ui-light);
        }

        &:focus-visible {
          border-color: var(--highlight-color);
        }
      }

      &.form-number-input {
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type='number'] {
          text-align: right;
        }
      }

      .form-toggle {
        .toggle-label {
          transition: color ${defaultTransitionProps};
        }

        &.checked .toggle-label {
          color: var(--hover-color);
        }
      }

      &.form-toggle-secondary {
        position: relative;

        .form-input-heading {
          ${formInputSecondary}
          margin-bottom: 0.5em;
          text-transform: inherit;
          letter-spacing: inherit;

          ${respond(`height: 38px;`, 60)}

          &.toggle {
            color: var(--color-neutral-text-extra-light);
          }
        }

        .toggle-indicator {
          position: absolute;
          top: -3px;
          right: 0;
        }

        .instructions {
          margin-bottom: 0;
        }
      }

      .button-secondary {
        display: inline-block;
        width: auto;

        &.button-secondary--wide {
          display: block;
          width: 100%;
        }
      }

      &.submit {
        .button-secondary, .button-secondary--dull {
          line-height: normal;

          + .button-secondary {
            margin-top: 0;
            margin-left: 15px;
          }
        }
      }
    }

    .form-date {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      ${respond(`flex-wrap: nowrap;`, 90)}

      > * {
        display: block;
        flex: 0 1 47.64%;
        margin-left: 0;

        ${respond(
          `
            flex: auto;

            &:not(:first-child) {
              margin-left: 15px;
            }
          `,
          90
        )}
      }

      .form-select {
        select {
          width: auto;
          min-width: 100%;
        }
      }

      .form-input {
        flex-basis: 100%;
        margin-top: 1em;

        ${respond(
          `
            flex-basis: auto;
            margin-top: 0;
          `,
          90
        )}
      }
    }

    .form-select {
      width: auto;

      &__icon {
        position: absolute;
        top: 42%;
        right: 4px;
        color: var(--highlight-color);
        pointer-events: none;
        transform: translateY(-50%);
      }

      select {
        ${formInputSecondary}
        padding: 0 ${FORM_SELECT_INLINE_END_PADDING}px 0.75em 0;
        font-size: 16px;
        line-height: normal;
        text-transform: none;

        &:focus-visible {
          border-color: var(--highlight-color);
        }
      }

      &.form-select--rounded {
        .form-select {
          width: auto;
        }

        .form-select__icon {
          position: absolute;
          top: 50%;
          right: ${FORM_SELECT_ICON_PADDING};
          width: ${FORM_SELECT_ICON_SIZE};
          height: ${FORM_SELECT_ICON_SIZE};
          color: currentColor;
          pointer-events: none;
          transform: translateY(-50%);
        }

        select {
          ${unstyledSelect}
          ${utilityPrimary}
          ${textTruncate}
          width: auto;
          height: 40px;
          padding-right: ${FORM_SELECT_INLINE_END_PADDING}px;
          padding-bottom: 0;
          padding-left: 13px;
          font-size: 13px;
          background-color: var(--select-bg-color); /* required for option to inherit in FF */
          border: 1px solid var(--color-neutral-ui-dull-light);
          border-radius: var(--box-border-radius);
          transition: border-color ${defaultTransitionProps};

          &:focus-visible {
            border-color: var(--highlight-color);
          }
        }
      }

    }

    .form-dropzone {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 350px;
      min-height: 200px;
      border: 1px solid var(--input-border-color);
      border-radius: var(--box-border-radius);
      transition: border-color 0.2s;

      .primary {
        ${utilityPrimary}
        padding-bottom: 0;
        font-size: 13px;
        font-weight: var(--font-weight-semibold);
        line-height: 1.5em;
        text-align: center;
      }

      .error {
        display: block;
        margin-top: 10px;
        color: var(--error-color);
      }

      .secondary {
        ${formLabelPrimary}
        padding-bottom: 0;
        margin-top: 10px;
        line-height: 1.5em;
        text-align: center;
      }

      a, .fake-link {
        ${setHoverStyle()}

        &:focus-visible {
          outline: 0;
        }
      }

      .contents-icon-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        .message {
          width: 100%;
          padding: 20px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        &__icon {
          display: block;
          margin: 0 auto 20px;
        }
      }

      .contents-image-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10px;

        .preview {
          max-width: 100%;
          max-height: 200px;
          background: var(--color-base-neutral20);
        }

        .message {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1;
          width: 75%;
          padding: 5px 20px 15px;
          margin-bottom: 20px;
          text-align: center;
          background: var(--color-base-neutral95);
          opacity: 0.9;
          transform: translate(-50%, -50%);
        }
      }

      .contents-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        padding: 15px;
      }

      .remove {
        ${utilityPrimary}
        position: absolute;
        right: 4px;
        bottom: 4px;
        z-index: 2;
        font-size: 12px;
      }

      .cover-upload-placeholder {
        max-width: 118px;
        height: auto;
      }

      .contents-empty__icon {
        display: block;
        color: var(--color-base-neutral-white);
      }
    }

    .boolean-labeled {
      display: table;

      span {
        ${formInputSecondary}
        display: table-cell;
        padding-bottom: 0.5em;
        vertical-align: middle;
      }

      .toggle-indicator {
        display: table-cell;
        padding-left: 10px;
        vertical-align: middle;
      }
    }

    .checkbox {
      margin-top: 5px;
    }
  }
`;
