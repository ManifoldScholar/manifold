import {
  transparentize,
  defaultTransitionProps,
  respond,
  loginFormPrimary
} from "theme/styles/mixins";

export default `
  .overlay-login {
    --color: var(--color-neutral-text-light);
    --highlight-color: var(--color-interaction-light);
    --focus-color: var(--color-interaction-light);
    --hover-color: var(--color-interaction-light);
    --input-border-color: var(--color-base-neutral-white);

    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 18px;
    font-family: var(--font-family-copy);
    color: var(--color);
    background-color: ${transparentize("neutral90", 0.025)};
    opacity: 1;
    transition: opacity 0s linear;

    a {
      text-decoration: underline;
    }

    &.overlay-full-enter {
      opacity: 0;
    }

    &.overlay-full-enter-active {
      opacity: 1;
      transition: opacity ${defaultTransitionProps};
    }

    &.overlay-full-exit {
      opacity: 0;
      transition: opacity ${defaultTransitionProps};
    }

    .container {
      padding-bottom: 100px;
    }

    .overlay-content {
      position: absolute;
      top: 80px;
      bottom: 0;
      z-index: 0;
      width: 100%;
      overflow: auto;

      &.focus {
        ${respond(`top: 0;`, 90)}

        .inner {
          max-width: 340px;
          margin: 0 auto;

          ${respond(`padding-top: 35px;`, 40)}
          ${respond(`padding-top: 126px;`, 90)}
        }
      }
    }

    .login-form {
      ${loginFormPrimary}

      input[type='text'],
      input[type='password'],
      input[type='submit'] {
        width: 100%;
      }
    }

    .login-external {
      margin-top: 45px;
    }
  }
`;
