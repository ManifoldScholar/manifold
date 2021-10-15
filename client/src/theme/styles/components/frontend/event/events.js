import { listUnstyled, respond } from "theme/styles/mixins";
import { eventEntity } from "theme/styles/variables/crossComponent";

export default `
  .event-list {
    ${listUnstyled}
    display: grid;
    grid-template-columns: auto;
    margin-top: -${eventEntity.rowGap};

    ${respond(
      `margin-left: -${eventEntity.iconSize.large};`,
      eventEntity.panelBreakpoint
    )}

    /* breakpoint equal to event-entity(min-width) * 2 + gutter + container padding */
    ${respond(
      `grid-template-columns: repeat(2, minmax(${eventEntity.minWidth}, 1fr));`,
      "692px"
    )}

    /* breakpoint equal to event-entity(min-width) * 3 + gutter + container padding */
    ${respond(
      `grid-template-columns: repeat(3, minmax(${eventEntity.minWidth}, 1fr));`,
      "1057px"
    )}

    &__item {
      display: flex;
      flex-grow: 1;
      min-width: 100%;
      margin-top: ${eventEntity.rowGap};

      ${respond(
        `
        padding-left: ${eventEntity.iconSize.small};`,
        eventEntity.panelBreakpoint
      )}
      ${respond(
        `flex-basis: calc(50% - 40px);
        min-width: ${eventEntity.minWidth};
        `,
        eventEntity.listLayoutBreakpoint
      )}
      ${respond(
        `flex-basis: calc(33.333% - 40px);
        margin-top: 40px;`,
        85
      )}
    }
  }
`;
