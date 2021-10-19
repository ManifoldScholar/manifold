import {
  panelRounded,
  respond,
  projectGridItem,
  utilityPrimary,
  rgba,
  defaultTransitionProps
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export default `
  .project-list.grid {
    .project-collections & {
      margin-right: 0;

      li {
        ${respond(
          `
          flex: 1 1 33.333%;
          max-width: 33.333%;
        `,
          75
        )}

        ${respond(
          `
          flex-basis: 25%;
          max-width: 25%;
        `,
          90
        )}
      }
    }

    .project-collections .drawer-backend.flexible & {
      ${respond(`width: 807px;`, `${(parseInt(breakpoints[95], 10) * 4) / 3}px`)}
    }
  }

  /* single projects while being reordered; requires styles to be re-created, since not nested in list while dragging */
  .project-collection-grid-item.orderable-list-item.dragging {
    .item-wrapper {
      ${projectGridItem}
      ${panelRounded}
    background-color: var(--color-base-neutral95);

      .name {
        .title-text {
          color: var(--color-base-neutral20);
        }
      }

      .relations-list {
        padding-top: 0.389em;
        font-size: 14px;
        color: var(--color-base-neutral40);
      }

      .label {
        ${utilityPrimary}
        padding-top: 15px;
        font-size: 14px;
        color: var(--color-base-neutral75);
        white-space: nowrap;
        vertical-align: top;
        transition: color ${defaultTransitionProps};
      }

      ${respond(
        `
        padding-right: 15px;
        padding-left: 15px;
        margin-right: -15px;
        margin-left: -15px;

        figure img {
          border-color: var(--color-accent-primary);
        }

        figure svg {
          fill: var(--color-accent-primary);
        }

        .title-text, .label {
          color: var(--color-accent-primary);
        }
      `,
        75,
        "max"
      )}

      ${respond(
        `
          padding: 20px 24px;
          box-shadow: 0 31px 26px -13px ${rgba("neutralBlack", 0.33)};

          .cover {
            height: 120px;

            svg {
              max-width: 100px;
              max-height: 110px;
            }
          }

          .relations-list {
            padding-top: 0.571em;
          }

          .label {
            padding-top: 15px;
          }
        `,
        75
      )}
    }
  }
`;
