import { entityFilterForm } from "theme/styles/variables/crossComponent";
import {
  respond,
  utilityPrimary,
  defaultHoverStyle
} from "theme/styles/mixins";

const filterGap = entityFilterForm.gap;
const filterMinWidth = entityFilterForm.selectMinWidth;

export default `
  /* Arranges section-heading, any details, search/filters, and body of section using flexbox
  Used on All Projects, Project Detail, & Project Collections detail pages */
  .entity-section-wrapper {
    display: flex;
    flex-direction: column;
    padding-top: 30px;

    ${respond(
      `flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;`,
      75
    )}

    &__heading {
      flex-grow: 1;
      order: -1;
      margin-bottom: 20px;

      + .entity-section-wrapper__body {
        /* if no .list-tools or .details */
        ${respond(`margin-top: 34px;`, 75)}
      }

      ${respond(
        `order: 0;
      margin-bottom: 0;`,
        75
      )}

      ${respond(
        `  flex-basis: 1%;
        order: 0;`,
        95
      )}

      &--wide {
        flex-basis: 100%;
        margin-bottom: 30px;
      }

      .main {
        align-items: center;

        .title {
          ${respond(`font-size: 18px;`, 75, "max")}
        }

        .manicon-svg:not(.collecting-toggle__icon) {
          position: relative;
          top: 2px;
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          margin-right: 6px;
          margin-left: -4px;
          color: var(--content-color, --color-neutral-ui-dark);

          ${respond(
            `width: 60px;
          height: 60px;
          margin-right: 14px;`,
            60
          )}

          &.icon-star-fill,
          &.icon-notes-unique {
            width: clamp(40px, 7.742vw, 48px);
            height: clamp(40px, 7.742vw, 48px);
          }
        }
      }

      .icon-star-fill--header {
        width: 48px;
        height: 48px;
        fill: transparent;

        .icon-star-fill__foreground {
          fill: var(--color-neutral-text-extra-dark);
        }

        .icon-star-fill__background {
          fill: var(--color-base-blue45);
        }
      }

      .icon-notes-unique {
        fill: transparent;

        &__foreground {
          fill: var(--color-neutral-text-extra-dark);
        }

        &__background {
          fill: var(--color-neutral-text-extra-light);
        }
      }
    }

    &__tools {
      width: 100%;
      padding-bottom: 0;
      margin-bottom: 36px;

      + .entity-section-wrapper__body {
        /* if no .details */
        margin-top: 18px;

        ${respond(
          `margin-top: 28px;

        &--pad-top {
          margin-top: 38px;
        }`,
          75
        )}
      }

      ${respond(`margin-top: 10px;`, 75)}

      ${respond(
        `
          flex-basis: calc(${filterMinWidth} * 3 + ${filterGap} * 2);
          margin-top: 0;
          margin-bottom: 0;
        `,
        95
      )}

      &--wide {
        flex-basis: 100%;
        margin-top: 30px;
        margin-bottom: 46px;
      }
    }

    &__details {
      order: -1;
      width: 100%;
      margin-bottom: 20px;
      line-height: 1.4;

      ${respond(
        `order: 0;
      margin-top: 28px;
      margin-bottom: 24px;`,
        75
      )}

      &:not(.entity-section-wrapper__details--wide) {
        ${respond(`margin-right: 50%;`, 95)}
      }

      &--wide {
        ${respond(`margin-right: 26%;`, 95)}
      }

      + .entity-section-wrapper__body.project-list.empty {
        margin-top: 6px;

        ${respond(`margin-top: 12px;`, 75)}
      }

      &--padded-top {
        margin-top: min(7.895vw, 60px);
      }

      .description {
        font-family: var(--font-family-heading);
        margin-bottom: 20px;
        font-size: 14px;
        line-height: 1.5;
        color: var(--color-base-neutral80);

        &:only-child:not(.pad-bottom) {
          margin-bottom: 0;
        }

        ${respond(`font-size: 16px;`, 75)}
      }
    }

    &__body {
      &:not(.project-list) {
        width: 100%;
      }

      &--narrow {
        max-width: 720px;
      }

      &--incomplete-header {
        margin-bottom: 20px;

        ${respond(`margin-bottom: 0;`, 40)}
      }

      &--warning {
        font-style: italic;

        i,
        em {
          font-style: normal;
        }
      }

      &--incomplete,
      &--notice {
        font-family: var(--font-family-heading);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 15px;
        font-weight: var(--font-weight-medium);
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-notification-warning-extra-light);
        border-radius: 8px;

        > div {
          margin-top: 15px;
          text-align: center;
        }

        svg {
          color: var(--warning-color);
        }

        .entity-section-wrapper__link-container {
          font-family: var(--font-family-copy);
          font-weight: var(--font-weight-regular);
          text-align: center;
        }

        span {
          display: block;

          + span {
            margin-top: 5px;
          }
        }

        a {
          &:hover,
          &:visited {
            color: inherit;
          }
        }

        ${respond(
          `
            flex-direction: row;
            justify-content: flex-start;
            padding: 35px 30px;

            svg {
              flex-shrink: 0;
            }

            > div {
              margin-top: 0;
              margin-left: 30px;
              text-align: left;
            }

            .entity-section-wrapper__link-container {
              text-align: left;
            }
          `,
          40
        )}
      }

      &--notice {
        background-color: var(--color-notification-notice-extra-light);

        svg {
          color: var(--notice-color);
        }
      }
    }

    &__utility {
      ${utilityPrimary}
      font-size: 14px;
      line-height: 1.57;

      &--footer {
        margin-top: 30px;

        ${respond(`margin-top: 20px;`, 75)}
      }

      a {
        display: flex;
        align-items: center;
        color: var(--color-base-neutral80);
        text-decoration: none;

        &:hover {
          ${defaultHoverStyle}
        }

        .manicon-svg {
          position: relative;
          top: -1px;
          width: 24px;
          height: 16px;
          margin-left: 12px;

          ${respond(
            `width: 30px;
          height: 20px;
          margin-left: 15px;`,
            75
          )}
        }
      }
    }

    &__pagination {
      width: 100%;
      margin-top: 30px;
    }
  }
`;
