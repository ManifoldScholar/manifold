import {
  panelRoundedDark,
  defaultTransitionProps,
  respond,
  rgba
} from "theme/styles/mixins";

export default `
  .project-list {
    .browse & {
      li {
        border-color: var(--color-neutral-ui-dull-dark);
        opacity: 1;
        transition: opacity ${defaultTransitionProps};
      }

      .grid-project-exit {
        opacity: 0;
      }

      .grid-project-enter {
        opacity: 0;
      }

      .name {
        color: var(--color-neutral-text-extra-dark);
      }

      .relations-list {
        padding-top: 0.4em;
        font-size: 15px;
        color: var(--color-neutral-ui-extra-dark);
      }

      .date {
        padding-top: 0.625em;
      }

      .alert::before {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin-right: 5px;
        margin-bottom: 2px;
        color: var(--color-base-neutral-white);
        content: "";
        background-color: var(--error-color);
        border-radius: 50%;
      }

      + .list-pagination-primary {
        margin-top: 30px;
      }

      &.empty {
        ${panelRoundedDark}
        width: 100%;
        padding: 20px 22px;
        background-color: var(--color-base-neutral10);

        ${respond(`padding: 24px 30px;`, 75)}

        .message {
          font-family: var(--font-family-heading);
          font-size: 16px;
          line-height: 1.313;
          color: var(--color-neutral-text-extra-dark);

          ${respond(`font-size: 18px;`, 75)}
        }
      }

      &.grid {
        li {
          padding-left: 14px;
        }

        ${respond(
          `
          li {
            padding-left: 0;
          }

          a {
            transition: background-color var(--transition-duration-default) ease-out,
              box-shadow var(--transition-duration-default) ease-out;
          }

          a:hover,
          a:focus-visible {
            background-color: var(--color-base-neutral05) 05;
            box-shadow: 0 31px 44px 2px ${rgba("neutralBlack", 0.13)};

            .title-text {
              color: var(--color-neutral-text-extra-dark);
            }
          `,
          75
        )}

          .cover {
            height: 160px;

            &.cover-placeholder {
              height: auto;
            }

            > svg {
              max-width: 130px;
              max-height: 130px;
            }
          }

          .name {
            font-size: 17px;
          }

          .relations-list {
            padding-top: 0.625em;
            font-size: 16px;
          }
        }
      }
    }

    .browse .bg-neutral05 &.grid {
      a:hover,
      a:focus-visible {
        ${respond(`background-color: var(--color-base-neutral10);`, 75)}
      }
    }
  }
`;
