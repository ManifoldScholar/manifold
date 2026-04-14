import { respond } from "theme/styles/mixins";
import { eventEntity } from "theme/styles/variables/crossComponent";

export default `
  .event-entity-row {
    position: relative;
    border-bottom: 1px solid var(--color-neutral-ui-dull-light);

    ${respond(`border-bottom: 0;`, eventEntity.panelBreakpoint)}

    &__inner {
      height: 100%;
    }

    .utility-button {
      position: absolute;
      right: 8px;
      bottom: 16px;
    }

    &--tile {
      .utility-button {
        right: 18px;
        bottom: 45px;
      }
    }
  }
`;
