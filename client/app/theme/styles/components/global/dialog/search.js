import {
  headingSecondary,
  headingQuaternary,
  subtitlePrimary,
  respond
} from "theme/styles/mixins";
import { dialog } from "theme/styles/variables/crossComponent";

const STICKY_MIN_HEIGHT = "900px";

function stickyPsuedoBackground(position = "below") {
  /* conceal top/bottom of dialog so content below form doesn't show on scroll */
  return `
    z-index: 1;
    background-color: var(--box-bg-color);

    &::before {
      position: absolute;
      top: ${position === "below" ? "auto" : "100%"};
      bottom: ${position === "below" ? "100%" : "auto"};
      left: 0;
      width: 100%;
      height: ${
        position === "below" ? dialog.paddingTop : dialog.paddingBottom
      };
      height: ${dialog.paddingTop};
      display: block;
      content: "";
      background-color: var(--box-bg-color);
    }
  `;
}

export default `
  .search-dialog {
    --box-bg-color: var(--color-base-neutral-white);

    position: relative;
    max-height: 95vh;
    overflow: auto;

    &__header {
      position: relative;
      z-index: 2;
      margin-top: min(5.26vw, 50px);
      margin-bottom: min(4.737vw, 45px);
      color: var(--strong-color);
    }

    &__heading {
      ${headingQuaternary}
      font-weight: var(--font-weight-semibold);
    }

    &__subheading {
      &,
      &:is(p) {
        ${headingSecondary}
        margin-top: 0.727em;
        margin-bottom: 0;
      }
    }

    &__instructions {
      &,
      &:is(p) {
        ${subtitlePrimary}
        margin-top: 1em;
        font-size: 16px;
        line-height: 1.5;
      }
    }

    &__form {
      padding-top: 0;
      padding-bottom: 20px;

      ${respond(
        `
          position: sticky;
          top: 0;
          ${stickyPsuedoBackground()}
        `,
        STICKY_MIN_HEIGHT,
        "min",
        "height"
      )}
    }

    &__results {
      font-weight: var(--font-weight-regular);
    }

    &__footer {
      padding-top: 20px;
      margin-top: 10px;

      ${respond(
        `
          position: sticky;
          bottom: 0;
          ${stickyPsuedoBackground("above")}
        `,
        STICKY_MIN_HEIGHT,
        "min",
        "height"
      )}
    }

    &__close-button {
      width: 100%;
    }
  }
`;
