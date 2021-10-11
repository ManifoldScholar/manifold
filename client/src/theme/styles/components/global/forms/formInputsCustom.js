import { respond, formLabelPrimary } from "theme/styles/mixins";

const BOOLEAN_HEIGHT = 26;
const BOOLEAN_WIDTH = BOOLEAN_HEIGHT * 2;
const BOOLEAN_PADDING = 4;

export default `
  /*
    Form Inputs that live outside a form element
    These are just as abstract as form elements, but don't require a wrapper
  */
  .checkbox-primary {
    ${formLabelPrimary}
    line-height: 25px;
    cursor: pointer;

    .bg-neutral90 & {
      .toggle-indicator {
        background-color: transparent;
        border: 1px solid var(--color-base-neutral80);
      }

      &.checked {
        .toggle-indicator {
          background-color: var(--color-base-neutral30);
        }
      }
    }

    .toggle-indicator {
      display: inline-block;
      width: 25px;
      height: 25px;
      padding: 7px 6px;
      vertical-align: middle;
      background-color: var(--color-base-neutral30);
    }

    .label {
      display: inline-block;
      margin-left: 9px;
      vertical-align: middle;
    }
  }

  .boolean-primary {
    position: relative;
    display: block;
    width: ${BOOLEAN_WIDTH}px;
    height: ${BOOLEAN_HEIGHT}px;
    cursor: pointer;
    background-color: var(--inactive-switch-bg-color);
    border-radius: ${BOOLEAN_HEIGHT}px;
    transition: background-color var(--transition-duration-slow)
      var(--transition-timing-function);

    &.checked {
      background-color: var(--active-switch-bg-color);

      &::before {
        transform: translateX(${BOOLEAN_WIDTH - BOOLEAN_HEIGHT}px);
      }
    }

    &::before {
      position: absolute;
      top: ${BOOLEAN_PADDING}px;
      left: ${BOOLEAN_PADDING}px;
      width: ${BOOLEAN_HEIGHT - BOOLEAN_PADDING * 2}px;
      height: ${BOOLEAN_HEIGHT - BOOLEAN_PADDING * 2}px;
      content: "";
      background-color: var(--switch-toggle-color);
      border-radius: ${BOOLEAN_HEIGHT}px;
      transition: transform var(--transition-duration-default)
        cubic-bezier(0.46, 0.03, 0.52, 0.96);
    }
  }

  .repeater-primary {
    .buttons-icon-horizontal {
      margin-bottom: 0;
    }

    .repeatable-input {
      position: relative;

      + .repeatable-input {
        margin-top: 24px;

        ${respond(`margin-top: 24px;`, 60)}
      }
    }
  }
`;
