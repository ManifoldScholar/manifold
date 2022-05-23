import { listUnstyled, drawerPadding, fluidScale } from "theme/styles/mixins";

export default `
  .annotation-list {
    ${listUnstyled}

    &--dark {
      --marker-bg-color: var(--box-medium-bg-color);

      background-color: var(--box-bg-color);
      border-bottom-right-radius: var(--box-border-radius);
      border-bottom-left-radius: var(--box-border-radius);
    }

    .annotation-comments {
      --Annotation-Detail-Inner-padding-block-start: ${fluidScale(
        "40px",
        "32px"
      )};

      ${drawerPadding("padding-right")}
      ${drawerPadding("padding-left")}
      padding-block-end: 37px;

      + .annotation-comments {
        --Annotation-Detail-Inner-border: 1px solid var(--color-base-neutral40);
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
