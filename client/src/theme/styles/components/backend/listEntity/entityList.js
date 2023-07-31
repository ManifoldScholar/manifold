import {
  listUnstyled,
  respond,
  dropzone,
  fillOnFocus,
  utilityPrimary
} from "theme/styles/mixins";
import { eventEntity } from "theme/styles/variables/crossComponent";

const GRID_ITEM_MIN_WIDTH = "194px";

export default `.entity-list {
  & + & {
    margin-top: 64px;
  }

  &--indented {
    padding-right: 24px;
    padding-left: 24px;
  }

  .instructional-copy {
    padding-bottom: 0;
  }

  &__title-block {
    margin: 0 0 32px;
  }

  &__title {
    font-family: var(--font-family-sans);
    font-size: 16px;
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-text-extra-light);
    text-transform: uppercase;
    letter-spacing: 2px;

    a,
    a:visited {
      color: var(--color-neutral-text-extra-light);
      text-decoration: none;
    }

    a:hover {
      color: var(--hover-color);
    }

    .utility-button {
      color: var(--color-neutral-text-light);
    }
  }

  &__title-icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    color: var(--hover-color);
  }

  &__list {
    ${listUnstyled}

    &--tiles {
      display: grid;
      grid-template-columns: auto;

      ${respond(
        `
          grid-template-columns: repeat(
            auto-fit,
            minmax(${eventEntity.minWidth}, 1fr)
          );
          margin-top: calc(
            ${eventEntity.listMarginTop} - ${eventEntity.rowGap}
          );
          margin-left: calc(-1 * ${eventEntity.iconSize.small}));
        `,
        eventEntity.panelBreakpoint
      )}

      ${respond(
        `margin-left: -1 / 2 * event-entity(icon-size-large);`,
        eventEntity.listLayoutBreakpoint
      )}

      /* breakpoint equal to event-entity(min-width) * 2 + gutter + remaining viewport space */
      ${respond(
        `grid-template-columns: repeat(2, minmax(event-entity(min-width), 1fr));`,
        "952px"
      )}

      li {
        min-width: 100%;

        ${respond(
          `padding-left: ${eventEntity.iconSize.small};
        margin-top: ${eventEntity.rowGap};`,
          eventEntity.panelBreakpoint
        )}

        ${respond(
          `
            flex-basis: 50%;
            min-width: ${eventEntity.minWidth};
            max-width: none;
            padding-left: ${eventEntity.columnGap};
          `,
          eventEntity.listLayoutBreakpoint
        )}
      }
    }

    &--well {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 10px 20px 20px;
      background-color: var(--color-base-neutral95);
      border-radius: 10px;
    }

    &--grid {
      ${respond(
        `
          margin-top: 22px;
          margin-left: -25px;
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(${GRID_ITEM_MIN_WIDTH}, 1fr)
          );

          li {
            flex-basis: 33.333%;
            flex-grow: 1;
            min-width: ${GRID_ITEM_MIN_WIDTH};
            border-bottom: none;
          }
        `,
        65
      )}

      ${respond(
        `
          li {
            flex-basis: 25%;
          }
        `,
        85
      )}
    }

    &--sortable {
      ${dropzone()}
      padding-top: 9px;
      padding-bottom: 9px;
      margin-top: -9px;
      margin-bottom: -9px;
    }
  }

  &__header {
    padding-top: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-neutral-ui-dull-light);
  }

  &--bare {
    .entity-list__header {
      padding-top: 0;
      padding-bottom: 0;
      border-bottom: 0;
    }
  }

  &__pagination {
    margin-top: 32px;
  }

  &__button {
    ${fillOnFocus("var(--color-accent-primary-pale)")}
    color: var(--highlight-color);

    & + & {
      margin-top: 24px;
    }

    ${respond(
      `
        display: inline-flex;

        & + & {
          margin-top: 0;
        }
      `,
      60
    )}
  }

  &__button-set-flex {
    display: flex;
    column-gap: 12px;
    row-gap: 16px;
    flex-direction: column;

    .entity-list__button + .entity-list__button {
      margin-top: 0;
    }

    ${respond(`flex-direction: row;`, 85)}

  }

  .entity-list__button-set {
    margin-bottom: 22px;
  }

  &__search {
    margin-bottom: 24px;
  }

  &__empty-message {
    font-family: var(--font-family-serif);
    padding: 18px 0;
    font-size: 17px;
    font-style: italic;
    border-bottom: 1px solid var(--color-neutral-text-dark);

    &--well {
      ${utilityPrimary}
      padding: 31px 25px;
      font-size: 14px;
      font-style: normal;
      background-color: var(--color-base-neutral95);
      border: none;
      border-radius: 10px;
    }
  }

  .entitlement-gid {
    font-family: var(--font-family-mono);
    font-style: normal;
    font-size: 14px;
    line-height: 1.5;
  }
}
`;
