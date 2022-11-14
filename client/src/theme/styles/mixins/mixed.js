import { buttonUnstyled, inputLabelPrimary } from "./appearance";

// The really messy mixins that jumble a bunch of other ones together
// Should become components!

// Form Layout
// --------------------------------------------------------
// TODO: This combines appearance mixins and should be a shared class or mixin
export const loginFormPrimary = `
  .field + .field {
    margin-top: 27px;
  }

  .login-links {
    margin-top: 25px;

    button {
      ${buttonUnstyled}
      display: block;
      font-style: italic;
      text-decoration-line: underline;

      + button {
        margin-top: 14px;
        margin-left: 0;
      }

      &.focus-visible {
        color: var(--hover-color);
      }
    }

    a {
      font-style: italic;

      + a {
        margin-top: 14px;
        margin-left: 0;
      }
    }
  }

  .button-secondary--dark {
    display: flex;
    width: 100%;
  }

  label {
    ${inputLabelPrimary}
  }

  .button-secondary {
    display: flex;
    margin-top: 30px;
  }
`;
