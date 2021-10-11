import { listUnstyled, drawerPadding, fluidScale } from "theme/styles/mixins";

export default `
  .annotation-list {
    ${listUnstyled}

    &--dark {
      background-color: var(--box-bg-color);
      border-bottom-right-radius: var(--box-border-radius);
      border-bottom-left-radius: var(--box-border-radius);
    }

    .annotation-comments {
      ${drawerPadding("padding-right")}
      ${drawerPadding("padding-left")}
      padding-top: ${fluidScale("40px", "32px")};
      padding-bottom: 37px;

      + .annotation-comments {
        margin-top: 23px;
        border-top: 1px solid var(--color-base-neutral40);
      }
    }

    /* More comments button has a special appearance if it's not in the last annotation */
    &:not(last-child) {
      .annotation-comment-thread .annotation-selection__button-trim {
        padding: 0;
        border: 0;
      }
    }
  }
`;
