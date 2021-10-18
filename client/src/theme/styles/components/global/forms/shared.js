import {
  respond,
  buttonUnstyled,
  buttonRounded,
  inputQuaternary,
  outlineOnFocus,
  defaultFocusStyle,
  defaultTransitionProps,
  setHoverStyle,
  screenReaderText,
  formLabelPrimary,
  selectPrimary,
  utilityPrimary
} from "theme/styles/mixins";

const VISIBILITY_TOGGLE_SIZE = 32;

export default `
  .search-button-inline {
    position: relative;

    .icon {
      ${buttonUnstyled}
      ${outlineOnFocus()}
      position: absolute;
      top: 50%;
      left: 10px;
      margin-top: -11px;
      font-size: 17px;
    }

    input {
      ${inputQuaternary}
      width: 100%;
      padding-left: 40px;
      border-color: var(--color-base-neutral40);
      border-radius: 0;
      appearance: none;
      transition: color ${defaultTransitionProps}, border-color ${defaultTransitionProps};

      &::placeholder {
        color: var(--color-base-neutral30);
      }

      &:focus-visible {
        color: var(--color-base-neutral-white);
        border-color: var(--focus-color);
      }
    }
  }

  .form-dropzone {
    cursor: pointer;

    &__inline-button {
      ${buttonUnstyled}
      display: inline;
      text-decoration: underline;
      text-transform: inherit;
      letter-spacing: inherit;
    }

    &__upload-prompt {
      ${setHoverStyle()}
      text-decoration: underline;
    }

    .dropzone-button {
      ${buttonUnstyled}
      ${buttonRounded}
      ${formLabelPrimary}
      padding: 25px 15px;
      font-weight: var(--font-weight-regular);
      line-height: 1.761;
      text-align: center;
      border: 2px solid;

      &__text {
        display: block;
        padding-left: 95px;
        text-align: left;
      }

      &__cancel-button {
        ${buttonUnstyled}
        position: absolute;
        top: -6px;
        right: -12px;
      }

      + .dropzone-button {
        margin-top: 25px;
      }
    }

    .dropzone-button-dotted {
      border: 2px dotted var(--color-base-neutral50);
    }

    input {
      ${screenReaderText}
      display: block !important;

      &:focus-visible {
        outline: 0;

        + [class^='contents-'] .form-dropzone__upload-prompt,
        + .dropzone-button .form-dropzone__upload-prompt {
          ${defaultFocusStyle}
          outline-color: var(--focus-color);
        }
      }
    }
  }

  .select-browse {
    ${selectPrimary}
    width: 100%;

    ${respond(
      `
      width: auto;
      min-width: 310px;`,
      30
    )}
  }

  .password-input {
    $visibility-toggle-size: 32px;

    position: relative;

    .hidden {
      display: none;
    }

    &__visibility-toggle {
      position: absolute;
      top: ${(-1 / 4) * VISIBILITY_TOGGLE_SIZE - 1}px;
      left: 80px;
      width: ${VISIBILITY_TOGGLE_SIZE}px;
      height: ${VISIBILITY_TOGGLE_SIZE}px;
      color: var(--color-base-neutral70);
      cursor: pointer;

      &:focus-visible {
        outline: 0;
      }
    }

    &__visibility-icon {
      position: absolute;
      cursor: pointer;
    }
  }

  .form-divider {
    ${utilityPrimary}
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 0;
    white-space: nowrap;

    &::before {
      margin-right: 25px;
      margin-left: 10px;
    }

    &::after {
      margin-right: 10px;
      margin-left: 25px;
    }

    &::before, &::after {
      width: 45%;
      height: 1px;
      content: '';
      background-color: var(--color-neutral-ui-dull-light);
    }
  }
`;
