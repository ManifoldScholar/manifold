import {
  buttonUnstyled,
  utilityPrimary,
  defaultHoverStyle,
  respond
} from "theme/styles/mixins";

const CLOSE_ICON_SIZE = "24px";

export default `
  .drawer-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &--pad-lateral {
      padding-right: 20px;
      padding-left: 20px;

      ${respond(
        `
          padding-right: 32px;
          padding-left: 32px;
        `,
        65
      )}
    }

    &--default {
      padding-bottom: 18px;

      ${respond(`padding-bottom: 26px;`, 50)}
    }

    &--reader {
      padding-top: 10px;
      padding-bottom: 12px;
      color: var(--strong-color);
      background-color: var(--box-medium-bg-color);
    }

    &__title {
      ${utilityPrimary}
      display: flex;
      flex-grow: 1;
      align-items: center;
      min-height: 24px;
      font-size: 13px;
      letter-spacing: 0.125em;
    }

    &__title-icon {
      position: relative;
      top: 2px;
      margin-right: 10px;
    }

    &__close-button {
      ${buttonUnstyled}
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;

      &--light {
        cursor: pointer;

        &:hover {
          ${defaultHoverStyle}
          outline: 0;
        }

        &:focus-visible {
          color: var(--focus-color);
        }
      }

      &--dark {
        font-size: 17px;
        cursor: pointer;
      }
    }

    &__close-text {
      ${utilityPrimary}
      margin-right: 10px;
      font-size: 13px;
      font-weight: var(--font-weight-semibold);
      line-height: ${CLOSE_ICON_SIZE};
      letter-spacing: 0.125em;
    }

    &__close-icon {
      width: ${CLOSE_ICON_SIZE};
      height: ${CLOSE_ICON_SIZE};
    }
  }
`;
