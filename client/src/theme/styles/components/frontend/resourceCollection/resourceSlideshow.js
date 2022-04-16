import {
  respond,
  utilityPrimary,
  buttonUnstyled,
  transparentize
} from "theme/styles/mixins";
import { containerPaddingInline } from "theme/styles/variables/layout";

const slideCopyFocus = "570px";

export default `
  .resource-slideshow {
    --focus-color: var(--color-interaction-light);
    --hover-color: var(--color-interaction-light);

    &__caption {
      position: relative;
      flex-grow: 1;
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
          /* Resource utility fade that hides part of the above description. Only displayed if description is present */
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
