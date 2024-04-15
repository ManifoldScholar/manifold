import { respond, listUnstyled, utilityPrimary } from "theme/styles/mixins";
import { uiPanelMenu } from "../uiPanelMenu";

export default `
  .visibility-menu {
    font-family: var(--font-family-heading);
    ${uiPanelMenu}

    ${respond(`width: 286px;`, 50)}

    &__section-list {
      ${listUnstyled}
    }

    &__filters {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;

      &--flex {
        ${respond(`flex-direction: row; gap: 32px;`, 20)}
      }
    }

    &__group {
      padding: 0;
      margin: 0;
      border: none;
    }

    &__group-icon {
      margin-right: 12px;
      margin-left: -2px;
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
        margin-left: 0;
      }

      &--flex {
        display: flex;
      }
    }

    &__footer {
      display: flex;
    }
  }
`;
