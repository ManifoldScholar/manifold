import { listUnstyled, respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export const eventEntity = {
  listMarginTop: "17px",
  listLayoutBreakpoint: breakpoints[65],
  rowGap: "28px",
  flexMaxWidth: "460.5px",
  minWidth: "332px",
  iconSizeSmall: "40px",
  iconSizeMed: "44px",
  iconSizeLarge: "48px",
  panelBreakpoint: breakpoints[60]
};

export default `
  .event-list {
    ${listUnstyled}
    display: flex;
    flex-flow: row wrap;
    margin-top: -${eventEntity.rowGap};

    ${respond(
      `margin-left: -${eventEntity.iconSizeLarge};`,
      eventEntity.panelBreakpoint
    )}

    @supports (grid-auto-columns: min-content) {
      display: grid;
      grid-template-columns: auto;

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
    }

    &__item {
      display: flex;
      flex-grow: 1;
      min-width: 100%;
      margin-top: ${eventEntity.rowGap};

      ${respond(
        `
        padding-left: ${eventEntity.iconSizeSmall};`,
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
        max-width: 417.58px;
        margin-top: 40px;

        @supports (grid-auto-columns: min-content) {
          max-width: none;
        }`,
        85
      )}
    }
  }
`;
