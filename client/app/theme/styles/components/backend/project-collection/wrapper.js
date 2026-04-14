import { respond, breakpointLessOne } from "theme/styles/mixins";

export default `
  .project-collections {
    /* show one column at a time on mobile */
    &.active-collection .backend-panel > .container {
      ${respond(
        `
        .project-collection-list {
          height: 0;
          visibility: hidden;
          opacity: 0;
        }

        .panel {
          visibility: visible;
          opacity: 1;
        }
      `,
        breakpointLessOne(75),
        "max"
      )}
    }

    &.empty .backend-panel > .container {
      ${respond(
        `
        .panel {
          visibility: visible;
          opacity: 1;
        }
      `,
        breakpointLessOne(75),
        "max"
      )}
    }

    .backend-panel {
      > .container {
        padding-top: 0;

        ${respond(
          `
          position: relative;
          flex-direction: column;

          > * {
            width: 100%;
            transition: opacity 0.5s var(--transition-timing-function);
          }

          .project-collection-list {
            visibility: visible;
            opacity: 1;
          }

          .panel {
            visibility: hidden;
            opacity: 0;
          }
        `,
          breakpointLessOne(75),
          "max"
        )}
      }
    }

    .drawer-backend {
      .form-number-input input[type="number"] {
        color: var(--color-accent-primary);
      }
    }
  }
`;
