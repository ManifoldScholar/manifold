import {
  listUnstyled,
  utilityPrimary,
  formInputPrimary,
  headingSecondary,
  subtitlePrimary,
  respond,
  fluidScale
} from "theme/styles/mixins";

export default `
  .results-list {
    margin-top: 1em;

    &.flush {
      margin-top: 0;
    }

    .no-results {
      ${utilityPrimary}
      font-size: 15px;
      color: var(--color-neutral-ui-dull-light);
    }

    ul {
      ${listUnstyled}

      li {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        padding: 10px 0 14px;

        ${respond(
          `
          flex-direction: row;
          align-items: center;
        `,
          60
        )}

        + li {
          border-top: 1px solid var(--color-neutral-ui-dull-light);
        }

        &:last-child {
          padding-bottom: 24px;
        }

        &.no-icon {
          padding: 6px 0 14px;
        }

        &.state-pending {
          color: var(--notice-color);

          a {
            color: inherit;
          }
        }

        &.state-failed {
          color: var(--error-color);
        }

        &.state-queued,
        &.state-importing {
          color: var(--warning-color);

          a {
            color: inherit;
          }
        }

        &.state-skipped {
          color: var(--color-neutral-ui-dull-light);
        }

        &.state-imported {
          color: var(--color-accent-primary-dull);

          a {
            color: inherit;
          }
        }
      }

      .results-body {
        order: 1;

        ${respond(`order: 0;`, 60)}

        a {
          color: var(--color-accent-primary);
        }
      }

      .results-header {
        ${formInputPrimary}
        width: 100%;
        margin: 0;
        font-size: ${fluidScale("20px", "16px")};
        line-height: 1.6em;

        .subtitle {
          ${headingSecondary}
          margin: 5px 0;
          font-size: ${fluidScale("16px", "14px")};
          line-height: 1.4;
        }

        &__icon {
          position: relative;
          top: -0.09em;
          margin-right: 10px;
        }
      }

      .results-desc {
        ${subtitlePrimary}
        padding-left: 25px;
        margin-top: 5px;

        &.flush {
          padding-left: 0;
        }

        .specifier {
          padding-left: 5px;
        }
      }

      .results-secondary {
        ${utilityPrimary}
        order: 0;
        margin-bottom: 2px;
        font-size: ${fluidScale("16px", "14px")};
        color: var(--color-neutral-text-light);
        white-space: nowrap;
        vertical-align: middle;

        ${respond(
          `
          order: 1;
          margin-bottom: 0;
          margin-left: 12px;
          text-align: right;
        `,
          60
        )}

        a {
          text-decoration: none;

          &:hover {
            color: var(--color-base-neutral20);
          }
        }
      }
    }
  }
`;
