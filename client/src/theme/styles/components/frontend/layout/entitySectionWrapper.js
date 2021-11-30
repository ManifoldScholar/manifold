import { respond } from "theme/styles/mixins";

export default `
  /* Arranges section-heading, any details, search/filters, and body of section using flexbox
  Used on All Projects, Project Detail, & Project Collections detail pages */
  .entity-section-wrapper {
    &__heading {
      flex-grow: 1;
      order: -1;
      margin-bottom: 20px;

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

          &.icon-star-fill {
            width: clamp(40px, 7.742vw, 48px);
            height: clamp(40px, 7.742vw, 48px);
          }
        }
      }
    }

    &__pagination {
      width: 100%;
      margin-top: 30px;
    }
  }
`;
