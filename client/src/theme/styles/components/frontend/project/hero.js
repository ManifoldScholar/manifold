import { breakpoints } from "theme/styles/variables/media";
import { respond, rgba, containerPrototype } from "theme/styles/mixins";
import { standaloneHeaderLayout } from "theme/styles/variables/crossComponent";

const gridGapSmall = "30px";
const rowGapMedium = "3.159vw";
const columnGapMedium = "4.839vw";
const rowGapLarge = "48px";
const columnGapLarge = "100px";
const rightColumnWidth = "28%";
const layoutBreakpoint = breakpoints[60];

export default `
  .project-hero {
    position: relative;
    padding-top: 20px;
    padding-bottom: 35px;

    color: var(--color-base-neutral-white);
    background-color: var(--color-base-neutral95);

    ${respond(
      `padding-top: 70px;
    padding-bottom: 80px;`,
      layoutBreakpoint
    )}

    /* Theme */
    &--light {
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--color-base-neutral05);
    }

    &--dark {
      --focus-color: var(--color-interaction-light);
      --hover-color: var(--color-interaction-light);
      --strong-color: currentColor;
    }

    &--standalone {
      padding-top: calc(${gridGapSmall} + var(--standalone-header-height);

      ${respond(`padding-top: 30px;`, layoutBreakpoint)}
    }

    &__bg-image-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 25;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        content: "";
        background-color: ${rgba("neutralBlack", 0.8)};
      }
    }

    &__bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }

    /* Layout */
    &__inner {
      ${containerPrototype}
      position: relative;
      z-index: 50;
      display: grid;
      grid-row-gap: ${gridGapSmall};
      max-width: ${standaloneHeaderLayout.maxWidth};

      ${respond(
        `
          grid-template-columns: 1fr minmax(220px, ${rightColumnWidth});
          row-gap: ${rowGapMedium};
          column-gap: ${columnGapMedium};
          padding-right: 20px;
          padding-left: 20px;
        `,
        layoutBreakpoint
      )}

      ${respond(
        `row-gap: ${rowGapLarge};
      column-gap: ${columnGapLarge};`,
        120
      )}
    }

    &__left-top-block,
    &__right-top-block {
      display: flex;
      flex-direction: column;
    }

    &__left-top-block {
      grid-row: 2;
      grid-column: 1;

      ${respond(
        `grid-row: 1;
      grid-column: 1;`,
        layoutBreakpoint
      )}
    }

    &__left-bottom-block {
      grid-row: 3;
      grid-column: 1;

      ${respond(
        `grid-row: 2;
      grid-column: 1;`,
        layoutBreakpoint
      )}
    }

    &__right-top-block {
      grid-row: 1;
      grid-column: 1;

      ${respond(
        `grid-row: 1;
      grid-column: 2;
      padding-right: 60px;`,
        layoutBreakpoint
      )}
    }

    &__right-bottom-block {
      grid-row: 4;
      grid-column: 1;

      ${respond(
        `grid-row: 2;
      grid-column: 2;
      align-self: end;`,
        layoutBreakpoint
      )}
    }

    &__meta-block {
      font-family: var(--font-family-copy);

      + .project-hero__callout-block {
        margin-top: 20px;
      }
    }

    &__cover-block {
      display: flex;
      flex-direction: column;
      align-items: center;

      ${respond(`align-items: flex-start;`, layoutBreakpoint)}
    }

    &__social-block {
      grid-area: social;

      .project-hero--light & {
        color: var(--color-neutral-text-dark);
      }
    }

    &__callout-block {
      &--mobile {
        display: block;

        ${respond(`display: none;`, layoutBreakpoint)}
      }

      &--desktop {
        display: none;

        ${respond(
          `display: block;
        width: 100%;`,
          layoutBreakpoint
        )}
      }

      & + & {
        margin-top: 12px;
      }

      + .project-hero__social-block {
        margin-top: 35px;
      }
    }

    /* Meta elements */
    &__heading {
      position: relative;
      z-index: 50;
      margin-bottom: 24px;
      hyphens: none;
      line-height: 1.188;

      .project-hero--standalone & {
        display: none;

        ${respond(`display: block;`, layoutBreakpoint)}
      }
    }

    &__title-and-toggle {
      display: flex;
    }

    &__title {
      font-family: var(--font-family-heading);
      margin: 0;
      font-size: 22px;
      font-weight: var(--font-weight-semibold);

      ${respond(`font-size: 32px;`, layoutBreakpoint)}

      .project-hero--standalone & {
        ${respond(`max-width: 90%;`, layoutBreakpoint)}
      }
    }

    &__collecting-toggle {
      margin-left: 12px;

      ${respond(`transform: translateY(8px);`, layoutBreakpoint)}
    }

    &__subtitle {
      font-family: var(--font-family-copy);
      margin-top: 2px;
      font-size: 18px;
      font-style: italic;
      letter-spacing: 0.028em;

      ${respond(
        `    margin-top: 11px;
          font-size: 24px;`,
        layoutBreakpoint
      )}

      em,
      i {
        font-style: normal;
      }
    }

    &__creators,
    &__contributors,
    &__description {
      font-size: 16px;
      letter-spacing: 0.012em;
    }

    &__creators,
    &__contributors {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      line-height: 1.313em;
    }

    &__creators {
      ${respond(
        `
          font-size: 20px;
        `,
        layoutBreakpoint
      )}

      + .project-hero__contributors {
        margin-top: 12px;
      }

      .maker-avatar {
        display: inline-flex;
        align-items: center;
        margin-right: 10px;

        &:not(:last-child) {
          &::after {
            display: inline;
            content: ", ";
          }
        }

        img,
        svg {
          display: inline-block;
          width: 42px;
          height: auto;
        }

        img {
          margin-right: 6px;
          border: 2px solid var(--color-base-neutral-white);
          border-radius: 100%;
        }

        svg {
          margin-right: 4px;
        }

        figcaption {
          display: inline-block;
        }
      }
    }

    &__maker-text {
      margin-left: 0.5ch;

      &:not(:last-child) {
        &::after {
          display: inline;
          content: ", ";
        }
      }
    }

    &__contributors,
    &__description {
      ${respond(
        `
          font-size: 17px;
        `,
        layoutBreakpoint
      )}
    }

    &__description {
      margin-top: 22px;
      line-height: 1.529em;

      ${respond(`margin-top: 45px;`, layoutBreakpoint)}
    }

    /* Link elements */
    &__link-inline {
    }

    /* Social elements */
    &__social-link,
    &__hashtag {
      color: inherit;
      text-decoration: none;
    }

    &__social-link {
      display: inline-block;
      padding: 5px;
      color: var(--color-neutral-ui-light);

      &:first-child {
        margin-left: -5px;
      }

      + .project-hero__hashtag {
        margin-top: 15px;
      }
    }

    &__hashtag {
      font-family: var(--font-family-heading);
      display: block;
      font-size: 16px;
      font-weight: var(--font-weight-semibold);

      ${respond(`font-size: 18px;`, layoutBreakpoint)}
    }

    /* Cover elements */
    &__figure {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      font-size: 0;

      ${respond(`align-items: flex-start;`, layoutBreakpoint)}

      &--constrained {
        width: 160px;
      }

      img {
        width: 100%;
        max-width: 120px;
        height: auto;

        ${respond(`max-width: 260px;`, layoutBreakpoint)}
      }

      svg {
        width: 111px;
        height: 111px;

        ${respond(
          `
            width: 160px;
            height: 160px;
          `,
          layoutBreakpoint
        )}
      }
    }

    /* Credits elements */
    &__credits-text {
      font-family: var(--font-family-copy);
      margin: 0;
      font-size: 16px;
      font-style: italic;
      color: var(--color-neutral-text-dark);
      letter-spacing: 0.012em;

      em {
        font-style: normal;
      }

      .project-hero--dark & {
        color: var(--color-neutral-text-light);
      }
    }
  }
`;
