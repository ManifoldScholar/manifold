import {
  respond,
  containerPrototype,
  utilityPrimary,
  buttonUnstyled
} from "theme/styles/mixins";
import { containerPadding } from "theme/styles/variables/layout";

const slideCopyFocus = "570px";

export default `
  .resource-slideshow {
    --focus-color: var(--color-interaction-light);
    --hover-color: var(--color-interaction-light);

    padding-bottom: 38px;

    ${respond(`${containerPrototype}`, 60)}

    &__figure {
      figure {
        height: calc(100% - 39px); /* Slide pagination footer height */

        ${respond(`height: 100%;`, 60)}
      }
    }

    &__footer {
      position: relative;
      padding: 10px ${containerPadding.responsive};
      color: var(--color-neutral-text-dark);

      ${respond(
        `display: flex;
      justify-content: flex-end;
      width: 100%;
      padding: 17px 23px;
      color: var(--color-neutral-text-light);
      background-color: var(--color-base-neutral90);`,
        60
      )}
    }

    &__caption {
      position: relative;
      flex-grow: 1;
    }

    &__pagination {
      position: absolute;
      bottom: 100%;
      left: 0;
      width: 100%;
      color: var(--color-neutral-text-light);
      text-align: center;
      background-color: transparentize(var(--color-base-neutral90), 0.1);

      ${respond(
        `  position: static;
        width: 160px;
        padding-top: 2px;
        text-align: right;
        background: transparent;`,
        60
      )}
    }

    &__ordinal {
      ${utilityPrimary}
      display: inline-block;
      padding: 11px 0 13px;
      font-size: 13px;
      letter-spacing: 0.05em;

      ${respond(
        `padding: 0;
      font-size: 16px;`,
        60
      )}
    }

    &__button {
      ${buttonUnstyled}
      ${utilityPrimary}
      position: absolute;
      top: 50%;
      display: inline-flex;
      align-items: center;
      margin-top: -9px;
      font-size: 13px;
      letter-spacing: 0.05em;

      ${respond(
        `position: static;
      margin-top: 13px;`,
        60
      )}

      &:disabled {
        opacity: 0.4;

        &:hover {
          color: var(--color-base-neutral40);
        }
      }

      &--previous {
        left: 20px;
      }

      &--next {
        right: 20px;
        float: right;

        ${respond(
          `margin-right: -4px;
        margin-left: 11px;`,
          60
        )}
      }
    }

    &__pagination-text {
      ${respond(`display: none;`, 60)}
    }

    &__pagination-icon {
      &--large {
        display: none;

        ${respond(`display: inline-block;`, 60)}
      }

      &--small {
        ${respond(`display: none;`, 60)}

        &.resource-slideshow__pagination-icon--right {
          margin-left: 8px;
        }

        &.resource-slideshow__pagination-icon--left {
          margin-right: 8px;
        }
      }
    }

    &__title {
      font-family: var(--font-family-heading);
      margin-top: 0;
      margin-bottom: 0.2em;
      font-size: 20px;
      font-weight: var(--font-weight-regular);
      hyphens: none;
      color: var(--color-base-neutral90);

      ${respond(
        `margin-bottom: 0.364em;
      font-size: 22px;
      color: var(--color-base-neutral05);`,
        60
      )}

      .overlay-full & {
        color: var(--color-base-neutral05);
      }
    }

    &__description {
      font-family: var(--font-family-copy);
      max-width: ${slideCopyFocus};
      height: 48px;
      padding-bottom: 5em;
      overflow: visible;
      font-size: 15px;

      ${respond(`padding-bottom: 3.5em;`, 40)}

      &--collapsed {
        overflow: hidden;
      }

      &--expanded {
        height: auto;
      }

      p + p {
        margin-top: 1em;
      }

      a {
        text-decoration: underline;
      }
    }

    &__utility {
      position: relative;

      &--expandable {
        &::before {
          /* Resource utility fade that hides part of the
          // above description
          // Only displayed if description is present */
          position: absolute;
          bottom: 100%;
          left: 0;
          display: block;
          width: 100%;
          height: 33px;
          content: "";
          box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral-white);

          ${respond(
            `box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral90);`,
            60
          )}

          .overlay-full & {
            box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral90);
          }
        }
      }
    }

    &__utility-inner {
      padding: 9px 0 13px;
      background-color: var(--color-base-neutral-white);

      ${respond(`background-color: var(--color-base-neutral90);`, 60)}

      .resource-slideshow__utility--expandable.resource-slideshow__utility--expanded
        & {
        margin-top: 0;
      }

      .overlay-full & {
        background-color: var(--color-base-neutral90);
      }
    }

    &__more-link,
    &__download-link,
    &__detail-link {
      ${utilityPrimary}
      ${buttonUnstyled}
      display: block;
      margin-top: 7px;
      font-size: 13px;
      text-decoration: none;

      ${respond(
        `display: inline;
      margin-top: 0;
      margin-right: 22px;`,
        40
      )}
    }

    &__more-link {
      /* Only show more link when expandable (see above) */
      display: none;

      .resource-slideshow__utility--expandable & {
        display: block;

        ${respond(`display: inline;`, 40)}
      }
    }

    &__close-text {
      display: none;

      .resource-slideshow__more-link--open & {
        display: inline;
      }
    }

    &__open-text {
      .resource-slideshow__more-link--open & {
        display: none;
      }
    }

    &__download-link {
      display: inline-flex;
      align-items: center;
    }

    &__download-icon {
      margin-left: 4px;
    }
  }
`;
