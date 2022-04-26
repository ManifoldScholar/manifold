import {
  respond,
  loginFormPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";

export default `
  .login-page {
    width: 100%;
    max-width: calc(300px + var(--container-padding-inline-narrow) * 2);
    margin: auto;

    ${respond(
      `max-width: calc(300px + var(--container-padding-inline-responsive) * 2);`,
      35
    )}

    ${respond(
      `max-width: calc(300px + var(--container-padding-inline-full) * 2);`,
      120
    )}

    .login-form {
      ${loginFormPrimary}
      font-size: 18px;
      font-family: var(--font-family-serif);

      input[type="text"],
      input[type="email"],
      input[type="password"] {
        border-color: var(--color-base-neutral40);
      }
    }

    .login-links {
      margin-top: 25px;
    }

    .login-external {
      margin-top: 45px;

      .button-secondary--dark {
        display: block;
        width: 100%;
      }
    }

    .login-notice {
      margin-bottom: 35px;
      font-size: var(--font-size-60);
      font-family: var(--font-family-sans);
    }

    .button-secondary {
      width: 100%;
    }

    .focusable-form {
      &:focus:not(.focus-visible) {
        outline: 0;
      }

      &.focus-visible {
        ${defaultFocusStyle}
        outline-offset: 5px;
      }
    }
  }
`;
