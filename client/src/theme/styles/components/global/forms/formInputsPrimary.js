import {
  buttonUnstyled,
  utilityPrimary,
  fillOnFocus,
  defaultFocusStyle,
  defaultHoverStyle,
  outlineOnFocus,
  defaultTransitionProps,
  formLabelPrimary,
  formInputPrimary,
  formInstructions,
  formInputMessage,
  formInputSecondary,
  listUnstyled,
  clearfix,
  respond
} from "theme/styles/mixins";

export default `
  .form-input {
    &--with-actions {
      display: grid;
      grid-template:
        "label label" auto
        "input input" auto
        "actions notification" auto / auto 1fr;

      ${respond(
        `
          grid-template:
            "label label label" auto
            "input notification actions" auto / 1fr auto auto;

          .form-input__action {
            transform: translateY(5px);
          }
        `,
        60
      )}

      label {
        grid-area: label;
      }

      input {
        grid-area: input;
      }

      .notification {
        grid-area: notification;

        ${respond(
          `
            padding-right: 10px;
            padding-left: 10px;
            margin-top: 7px !important;
            border-bottom: 1px solid var(--color-base-neutral80);
          `,
          60
        )}
      }

      .instructions {
        grid-column: 1 / -1;
        margin-bottom: 1em !important;

        ${respond(`margin-bottom: 0 !important;`, 60)}
      }

      .form-input__action-group {
        grid-area: actions;
      }
    }

    & + & {
      margin-top: 40px;
    }

    &__wrapper {
      padding: 0;
      margin: 0;
      border: none;
    }

    &__action-group {
      margin-top: 12px;

      ${respond(
        `
          margin-top: 0;
          border-bottom: 1px solid var(--color-base-neutral80);
        `,
        60
      )}
    }

    &__action {
      ${buttonUnstyled}
      ${utilityPrimary}
      ${fillOnFocus("var(--accent-interaction-light)")}
      padding: 0.333em 1em;
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      text-decoration: none;
      letter-spacing: 0.125em;
      background-color: var(--color-base-neutral10);
      border: 1px solid var(--color-base-neutral10);
      border-radius: 16px;
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      &:hover {
        background-color: var(--color-base-neutral20);
      }

      & + & {
        margin-left: 8px;
      }
    }

    label:not(.checkbox):not(.radio):not(.toggle):not(.icon-picker):not(.form-switch) {
      ${formLabelPrimary}
      display: block;
      margin-bottom: 1em;

      &.has-instructions {
        margin-bottom: 0.5em;
      }
    }

    .instructions {
      ${formInstructions}
      display: block;
      margin-bottom: 1em;

      a:visited {
        color: inherit;
      }

      &.space-bottom {
        margin-bottom: 2em;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    input[type="text"]:not(.range-picker__input),
    input[type="email"],
    input[type="password"] {
      ${formInputPrimary}
      width: 100%;
      height: 60px;
      padding: 0.7em 1em;
      background-color: var(--color-base-neutral05);
      border: 1px solid transparent;
      border-radius: 0;
      outline: 0;
      transition: border-color ${defaultTransitionProps};
      appearance: none;

      &:focus-visible {
        border-color: var(--hover-color);
      }

      .bg-neutral05 & {
        background-color: var(--color-base-neutral-white);
      }
    }

    textarea {
      ${formInputPrimary}
      width: 100%;
      padding: 1.2em 1.5em;
      resize: vertical;
      background-color: var(--color-base-neutral05);
      border: 1px solid transparent;
      outline: none;
      transition: border-color ${defaultTransitionProps};

      &:focus-visible {
        border-color: var(--hover-color);
      }

      .bg-neutral05 & {
        background-color: var(--color-base-neutral-white);
      }

      &.wide {
        padding: 0.7em 1em;
      }

      &.large {
        min-height: 250px;
      }
    }

    .button-secondary {
      display: block;
      width: 100%;

      + .button-secondary {
        margin-top: 21px;
      }
    }

    & &-radios {
      &__wrapper,
      &__legend {
        padding: 0;
        margin: 0;
        border: none;
      }

      &__legend {
        + .instructions {
          margin-top: 7px;
        }
      }

      &__title {
        ${formLabelPrimary}
        display: inline-block;
      }

      &__prompt {
        ${utilityPrimary}
        display: block;
        font-size: 18px;
        font-weight: var(--font-weight-regular);
        text-transform: none;
        letter-spacing: 0;
      }
    }

    .errors {
      display: block;
    }
  }

  .form-error {
    .error {
      ${formInputMessage}
      display: inline-block;
      margin-top: 15px;
      color: var(--error-color);
    }
  }

  .form-error-grouped {
    margin-bottom: 15px;

    .dialog & {
      max-width: 80%;
    }

    .error {
      margin-top: 0;
    }
  }

  .form-select {
    position: relative;
    display: inline-block;
    width: 100%;

    &__disclosure-icon {
      position: absolute;
      top: 50%;
      right: 12px;
      color: var(--hover-color);
      pointer-events: none;
      transform: translateY(-50%);
    }

    select {
      ${formInputSecondary}
      display: inline-block;
      width: 100%;
      height: 4.286em;
      padding: 1.286em 55px 1.286em 2.214em;
      margin: 0;
      cursor: pointer;
      background-color: var(--color-base-neutral05);
      border: 1px solid transparent;
      border-radius: 0;
      outline: none;
      transition: border-color ${defaultTransitionProps};
      appearance: none;

      .bg-neutral05 & {
        background-color: var(--color-base-neutral-white);
      }

      &:focus-visible {
        border-color: var(--hover-color);
      }

      &:focus-visible:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 var(--color-neutral-text-dark);

        .backend & {
          text-shadow: 0 0 0 var(--color-neutral-text-extra-light);
        }
      }

      &::-ms-expand {
        display: none;
      }

      option {
        color: var(--color-neutral-text-extra-dark);
      }
    }
  }

  .form-toggle {
    ${formLabelPrimary}
    position: relative;
    display: block;
    padding-left: 33px;
    margin-bottom: 0;
    font-size: 13px;
    cursor: pointer;

    ${respond(`font-size: 16px;`, 60)}

    + .form-toggle {
      margin-top: 18px;
    }

    &.horizontal {
      display: inline-block;

      + .form-toggle {
        margin-top: 0;
        margin-left: 38px;
      }
    }

    &.annotated {
      ${formInputPrimary}
      color: var(--color-neutral-text-extra-dark);
      text-transform: none;
    }

    input {
      position: absolute;
      z-index: -1;
      opacity: 0;

      &:focus-visible ~ .toggle-indicator {
        background-color: var(--color-accent-primary-light);
      }
    }

    .toggle-indicator {
      position: absolute;
      left: 0;
      display: block;
      user-select: none;
      background-color: var(--color-base-neutral30);
      transition: background-color ${defaultTransitionProps};

      .bg-neutral90 &,
      .form-callout & {
        background-color: var(--color-neutral-ui-dark);
      }
    }

    &.checkbox {
      line-height: 1.563em;

      .toggle-indicator {
        width: 1.563em;
        height: 1.563em;
        padding: 0.438em 0.375em;
      }
    }

    &.radio {
      line-height: 1.25em;

      input[type="radio"] {
        &:focus-visible ~ .toggle-label {
          ${defaultFocusStyle}
          outline-offset: 2px;
        }
      }

      .toggle-label {
        font-size: 14px;
      }

      + .toggle-instructions {
        display: block;
        padding-left: 33px;
        margin-top: 6px;
        font-size: 16px;
        font-family: var(--font-family-copy);
        font-style: italic;
        text-transform: none;

        + .form-toggle.radio {
          margin-top: 16px;
        }
      }

      .toggle-indicator {
        width: 1.25em;
        height: 1.25em;
        padding-top: 0.313em;
        text-align: center;
        border-radius: 100%;

        &::before {
          display: inline-block;
          width: 0.625em;
          height: 0.625em;
          vertical-align: top;
          content: "";
          background-color: var(--color-base-neutral90);
          border-radius: 100%;
          opacity: 0;
          transition: opacity ${defaultTransitionProps};
        }
      }

      &.checked .toggle-indicator {
        background-color: var(--accent-primary-light);
      }

      &.inline {
        display: block;
        font-size: 16px;

        ${respond(
          `
            display: inline-block;

            + .radio {
              margin-top: 0;
              margin-left: 35px;
            }`,
          50
        )}
      }
    }

    .toggle-note {
      display: block;
      margin-top: 13px;
      font-size: 16px;
      font-family: var(--font-family-copy);
      font-style: italic;
      line-height: 1.375;
    }

    &.checked .toggle-indicator {
      &::before {
        opacity: 1;
      }
    }
  }

  .form-switch {
    position: relative;
    display: block;
    cursor: pointer;

    input {
      position: absolute;
      z-index: -1;
      opacity: 0;

      &:focus-visible ~ .toggle-indicator .boolean-primary {
        ${defaultFocusStyle}
        outline-offset: 2px;
      }
    }
  }

  .form-date {
    .input-day {
      margin-left: 15px;
    }

    .form-input {
      position: relative;
      display: inline-block;
      margin-left: 15px;
      vertical-align: bottom;

      .input-year {
        .form-primary & {
          display: inline;
          width: calc(91vw - 242px);
          min-width: 49px;
          max-width: 100px;

          ${respond(`width: calc(91vw - 372px);`, 40)}
        }
      }
    }
  }

  .form-date-picker,
  .range-picker {
    position: relative;

    &__button {
      ${utilityPrimary}
      ${buttonUnstyled}
      position: absolute;
      right: 0;
      bottom: 1em;
      z-index: 10;
      font-size: 12px;

      ${respond(`bottom: 1.45em;`, 60)}
    }

    .react-datepicker {
      color: var(--color);
      background-color: transparent;
      border: none;
      box-shadow: 10px 31px 44px 2px rgba(var(--color-base-neutral-black), 0.13);
      font-family: var(--font-family-sans);

      &-wrapper {
        width: 100%;
      }

      &__triangle {
        display: none;
      }

      &__navigation {
        top: 9px;
        width: auto;
        height: auto;
        font-size: 16px;
        line-height: 1;
        text-indent: unset;
        background-color: transparent;
        border: none;

        &--previous {
          left: 20px;
        }

        &--next {
          right: 20px;
        }
      }

      &__input-container {
        display: block;
      }

      &__close-icon {
        display: none;
      }

      &__header {
        background-color: var(--color-base-neutral110);
        border: none;

        .browse &,
        .reader.scheme-light &,
        .bg-white & {
          background-color: var(--box-medium-bg-color);
        }
      }

      &__current-month {
        color: var(--strong-color);
      }

      &__day-name {
        color: inherit;
      }

      &__month-container {
        background-color: var(--box-bg-color);
        border-radius: 8px;
      }

      &__day {
        height: 1.7rem;
        line-height: 1.45rem;
        line-height: 1.45rem;
        color: inherit;
        border: 1px solid transparent;
        border-radius: 50%;
        transition: color ${defaultTransitionProps},
          border-color ${defaultTransitionProps},
          background-color ${defaultTransitionProps};

        &--keyboard-selected,
        &--selected {
          ${defaultHoverStyle}
          background-color: var(--box-x-strong-bg-color);
        }

        &:hover {
          ${defaultHoverStyle}
          background-color: var(--box-strong-bg-color);
        }
      }
    }
  }

  .form-callout {
    padding: 54px 30px;
    background-color: var(--color-base-neutral10);

    header {
      ${formLabelPrimary}
      padding-bottom: 53px;
      text-align: center;
    }

    + .form-input {
      margin-top: 40px;
    }
  }

  .form-column-map {
    ${respond(
      `
        display: flex;
        margin-left: -35px;
      `,
      80
    )}

    .column {
      ${respond(`padding-left: 35px;`, 80)}

      + .column {
        margin-top: 30px;

        ${respond(`margin-top: 0;`, 80)}
      }
    }

    .column-mappable {
      flex-grow: 1;
      width: 100%;
      ${respond(`width: calc(100% - 28vw);`, 80)}
      ${respond(`width: calc(100% - 29vw);`, 85)}
      ${respond(`width: calc(100% - 360px);`, 110)}
    }

    .available {
      max-height: 700px;
      padding: 0.8em;
      margin-top: 10px;
      overflow-y: scroll;
      font-size: 14px;
      user-select: none;
      background-color: var(--color-base-neutral85);

      ${respond(`margin-top: 15px;`, 50)}
      ${respond(`font-size: 16px;`, 90)}

      .form-column-listing + .form-column-listing {
        margin-top: 0.8em;
      }
    }

    .mappable {
      ${listUnstyled}
      max-height: 700px;
      padding: 0.8em;
      margin-top: 10px;
      overflow-y: scroll;
      font-size: 14px;
      background-color: var(--color-neutral-ui-extra-dark);

      ${respond(`margin-top: 15px;`, 50)}
      ${respond(`font-size: 16px;`, 90)}

      li + li {
        margin-top: calc(0.8em - 2px);
      }

      .mapping {
        ${clearfix()}
        position: relative;
        width: 100%;
        font-family: var(--font-family-sans);

        .column-label {
          position: relative;
          float: left;
          width: 50%;
          padding: 0.6em 0.8em;
          font-weight: var(--font-weight-medium);
          color: var(--color-neutral-text-extra-dark);
          background-color: var(--color-base-neutral40);

          ${respond(`width: calc(100% - 21vw);`, 80)}
          ${respond(`width: calc(100% - 23vw);`, 85)}
          ${respond(`width: calc(100% - 300px);`, 110)}

          .truncate {
            display: block;
            max-width: 350px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &::after {
            position: absolute;
            top: 0;
            right: -1em;
            z-index: 10;
            width: 0;
            height: 0;
            content: "";
            border-color: transparent transparent transparent
              var(--color-base-neutral40);
            border-style: solid;
            border-width: 1.2em 0 1.2em 1em;
          }
        }
      }

      .well {
        float: left;
        width: 50%;

        ${respond(`width: 21vw;`, 80)}
        ${respond(`width: 23vw;`, 85)}
        ${respond(`width: 300px;`, 110)}

        &::before {
          position: absolute;
          top: -2px;
          left: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          pointer-events: none;
          content: "";
          background: transparent;
          border: 2px solid var(--color-neutral-ui-extra-dark);
        }

        &.drag-over::before {
          border-color: var(--highlight-color);
        }

        &.matched {
          .placeholder {
            position: absolute;
          }
        }

        @keyframes cancelAppear {
          0% {
            visibility: hidden;
            opacity: 0;
          }

          1% {
            visibility: visible;
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        .cancel {
          visibility: visible;
          opacity: 1;
          animation: cancelAppear var(--transition-duration-fast) var(--transition-timing-function) 0s 1;
        }
      }

      .placeholder {
        top: 0;
        z-index: -1;
        display: block;
        padding: 0.6em 0.8em 0.6em 1.6em;
        color: var(--color-base-neutral45);
      }

      [data-rbd-placeholder-context-id] {
        height: 0 !important;
      }
    }
  }

  .form-column-listing {
    position: relative;

    .cancel {
      ${buttonUnstyled}
      ${outlineOnFocus("var(--error-color)")}
      position: absolute;
      top: 50%;
      right: 0;
      width: 38px;
      height: 100%;
      font-size: 0;
      color: var(--color-neutral-text-extra-dark);
      transform: translateY(-50%);

      &:hover {
        color: var(--error-color);
      }

      &:focus-visible {
        outline-offset: -4px;
      }
    }
  }

  .form-column-available {
    position: relative;
    width: 100%;
    padding-left: calc(1em - 1px);
    list-style: none;
    outline: none;

    ${respond(`width: 21vw;`, 80)}
    ${respond(`width: 23vw;`, 85)}
    ${respond(`width: 300px;`, 110)}

    .text {
      display: block;
      padding: 0.6em 0.8em;
      overflow: hidden;
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-semibold);
      color: var(--color-neutral-text-extra-dark);
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: var(--color-base-neutral05);
      transition: background-color ${defaultTransitionProps};

      .matched & {
        padding-right: 40px;
      }
    }

    &:hover,
    &:focus-visible {
      .text {
        background-color: var(--color-accent-primary-pale);
      }

      &::before {
        border-color: var(--color-accent-primary-pale) transparent transparent
          transparent;
      }

      &::after {
        border-color: transparent transparent var(--color-accent-primary-pale)
          transparent;
      }
    }

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      content: "";
      border-color: var(--color-base-neutral05) transparent transparent transparent;
      border-style: solid;
      border-width: 1.2em 0 1.2em 1em;
      transition: border-color ${defaultTransitionProps};
    }

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      content: "";
      border-color: transparent transparent var(--color-base-neutral05) transparent;
      border-style: solid;
      border-width: 1.2em 0 1.2em 1em;
      transition: border-color ${defaultTransitionProps};
    }
  }
`;
