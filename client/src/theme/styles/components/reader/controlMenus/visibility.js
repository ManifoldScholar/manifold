import {
  buttonUnstyled,
  respond,
  listUnstyled,
  utilityPrimary
} from "theme/styles/mixins";
import { uiPanelMenu } from "../uiPanelMenu";

export default `
  .button-visibility {
    ${buttonUnstyled}
    position: relative;
    height: 100%;
    padding: 0 14px;
    color: var(--color-base-neutral50);
    transition: color var(--transition-duration-fast)
      var(--transition-timing-function);
  }

  .visibility-menu {
    font-family: var(--font-family-heading);
    ${uiPanelMenu}
    color: var(--color-base-neutral75);

    ${respond(`width: 286px;`, 50)}

    &__section-list {
      ${listUnstyled}
    }

    &__group {
      padding: 0;
      margin: 0;
      border: none;
    }

    &__group-icon {
      margin-right: 12px;
      margin-left: -2px;
      color: var(--color-base-neutral75);
    }

    &__group-name {
      position: relative;
      top: 1px;
    }

    &__legend {
      ${utilityPrimary}
      font-size: 13px;
    }

    &__checkbox {
      & + & {
        margin-left: 32px;
      }

      &--block {
        display: block;

        & + & {
          margin-top: 14px;
          margin-left: 0;
        }
      }
    }

    &__footer {
      display: flex;
    }
  }
`;