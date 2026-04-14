import {
  panelRounded,
  respond,
  fluidScale,
  drawerIndent,
  listUnstyled
} from "theme/styles/mixins";

export default `
  .selection-group-heading {
    ${panelRounded}
    padding: 0.833em min(3.75vw, 30px);
    font-size: ${fluidScale("18px", "21px")};
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-medium);
    color: var(--strong-color);

    > * {
      margin: 0;
      font-weight: inherit;
    }
  }

  .annotation-comment-thread {
    padding-top: 22px;

    .annotation-comment-thread {
      .comment-list {
        padding-left: 0;

        ${respond(drawerIndent("padding-left"), 70)}
      }

      .annotation-comment-thread {
        .comment-list {
          padding-left: 0;

          ${respond(drawerIndent("padding-left"), 95)}
        }

        .annotation-comment-thread {
          .comment-list {
            padding-left: 0;
          }
        }
      }
    }

    .comment-list {
      ${listUnstyled}
      ${drawerIndent("padding-left")}

      .annotation-reply {
        + .annotation-reply {
          padding-top: 20px;
        }
      }
    }
  }
`;
