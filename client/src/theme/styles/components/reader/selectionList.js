import { listUnstyled, fluidScale } from "theme/styles/mixins";

export default `
  .selection-list {
    ${listUnstyled}

    /* Separated list, used on list pages/overlays */
  &--separated {
      .selection-group-heading + li {
        margin-top: 35px;
      }

      li + .selection-group-heading {
        margin-top: 96px;
      }

      .annotation-detail .selection-text,
      .annotation-detail > .container,
      .annotation-highlight-detail {
        padding-right: ${fluidScale("20px", "89px")};
        padding-left: ${fluidScale("20px", "89px")};
      }
    }
  }
`;
