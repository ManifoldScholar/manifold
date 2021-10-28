import { respond } from "theme/styles/mixins";
import { dashboardLayoutBreakpoint } from "theme/styles/variables/crossComponent";

/*
 * Backend analytics grid for dashboard, projects, and texts
 *
 * This grid has 2, 3, or 4 columns depending on the width of its container.
 * Without container queries in CSS yet :(, it's necessary to use separate media queries
 * for each layout context, and adjust the flow of grid items within that context.
 * Grid layouts in the RangePicker component also need to be defined per context.
 */

const ITEM_MIN_WIDTH = 250;
const GAP = 30;
const STACK_BREAKPOINT = ITEM_MIN_WIDTH * 2 + GAP;
const TWO_COL_BREAKPOINT = 1150;
const THREE_COL_BREAKPOINT = 960;
const FOUR_COL_BREAKPOINT = ITEM_MIN_WIDTH * 4 + GAP * 3;

export default `
  .analytics-grid {
    display: grid;
    grid-template-columns: 100%;
    grid-gap: ${GAP}px;

    ${respond(
      `.analytics-grid__item {
        grid-column-end: -1;
      }`,
      `${STACK_BREAKPOINT - 1}px`,
      "max"
    )}

    ${respond(
      `grid-template-columns: repeat(2, minmax(0, 1fr));`,
      `${STACK_BREAKPOINT}px`
    )}

    .range-picker,
    .range-picker__preset-group-inner {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &--4-col {
      ${respond(
        `
          grid-template-columns: repeat(4, minmax(0, 1fr));

          .range-picker {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .range-picker__preset-group-inner {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }
        `,
        `${FOUR_COL_BREAKPOINT}px`
      )}
    }

    &--3-col {
      ${respond(
        `
          grid-template-columns: repeat(3, minmax(0, 1fr));

          .analytics-grid__item--50 {
            grid-column: 1 / -1;
          }

          .range-picker {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .range-picker__preset-group-inner {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }
        `,
        `${THREE_COL_BREAKPOINT}px`
      )}
    }

    &--2-col {
      ${respond(`grid-template-columns: 100%;`, dashboardLayoutBreakpoint)}

      ${respond(
        `grid-template-columns: repeat(2, minmax(0, 1fr));`,
        `${TWO_COL_BREAKPOINT}px`
      )}
    }

    &__item {
      &--100 {
        grid-column: 1 / -1;
      }

      &--50 {
        grid-column-end: span 2;
      }

      &--25 {
        grid-column-end: span 1;
      }
    }
  }
`;
