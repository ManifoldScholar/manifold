import {
  utilityPrimary,
  panelRounded,
  respond,
  rgba,
  buttonUnstyled
} from "theme/styles/mixins";
import { dialog } from "theme/styles/variables/crossComponent";

export default `
.dialog {
  ${utilityPrimary}
  ${panelRounded}
  position: relative;
  width: 100%;
  max-width: 880px;
  padding: ${dialog.paddingTop} 6.818% ${dialog.paddingBottom};
  margin: 0 auto;
  text-transform: none;
  letter-spacing: 0;
  box-shadow: 0 31px 44px 2px ${rgba("neutralBlack", 0.13)};

  ${respond(
    `
      padding-right: 40px;
      padding-left: 40px;
    `,
    90
  )}

  &__header {
    padding: 11px 0 22px;

    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      font-size: 22px;
      font-family: var(--font-family-sans);
      hyphens: none;

      .backend & {
        color: var(--color-base-neutral-white);
      }
    }
  }

  &__body {
    margin-top: 34px;
    margin-bottom: 0;

    .buttons-icon-horizontal {
      margin-bottom: 0;
    }
  }

  &__close {
    ${buttonUnstyled}
    position: absolute;
    top: auto;
    right: 32px;
    cursor: pointer;
  }

  p:not([class]) {
    font-size: 18px;
    font-weight: var(--font-weight-regular);
  }
}

.dialog.dialog-error {
  max-width: 500px;

  .backend & {
    font-weight: var(--font-weight-regular);
    color: var(--strong-color);
    background-color: var(--color-notification-error-extra-light);
  }

  .dialog__header {
    h1, h2, h3, h4, h5, h6 {
      color: inherit;
    }
  }

  .close-button-primary {
    color: inherit;
  }
}

`;
