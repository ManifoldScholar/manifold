import { defaultTransitionProps, respond } from "theme/styles/mixins";
import { containerWidth } from "theme/styles/variables/layout";

const iconSize = "60px";
const heroMaxHeight = "340px";
const gapSize = "30px";

export default `
  .project-collection-header {
    font-family: var(--font-family-heading);
    display: grid;
    grid-template-areas:
      "title"
      "description";
    grid-gap: ${gapSize};
    margin-bottom: ${gapSize};
    color: var(--color-base-neutral90);

    /* For the configurations where the description is at the
    // bottom of the grid, but there is no description present.
    // The cell will still exist but the content will not, so the
    // grid-gap will serve as an unwanted additional bottom padding. */
    &--no-description {
      margin-bottom: 0;
    }

    &--square {
      grid-template-areas:
        "title"
        "image"
        "description";

      ${respond(
        `
          grid-template-areas:
            "image title"
            "image description";
          grid-template-rows: auto 1fr;
          grid-template-columns: ${heroMaxHeight} auto;
          /* Add the margin bottom back in for the square configuration
          // where the description is not at the bottom of the grid. */
          margin-bottom: ${gapSize};
        `,
        75
      )}
    }

    &--wide {
      grid-template-areas:
        "title"
        "image"
        "description";
    }

    &--full {
      grid-template-areas:
        "image"
        "title"
        "description";
    }

    &__header {
      display: flex;
      grid-area: title;
      align-items: center;
      transition: color ${defaultTransitionProps};

      &--link {
        text-decoration: none;
      }
    }

    &__filter {
      /* While the designs would call for the standard gap size here,
      // a little extra space should be given for the reset search button. */
      margin-bottom: ${gapSize} + 10px;
    }

    &__title {
      margin: 0;

      /* These two rules are temporary additions and should be eventually
      // defined by the parent component */
      font-size: 26px;
      font-weight: 500;
    }

    &__description {
      grid-area: description;
      hyphens: manual;
      line-height: 1.5;
      color: var(--color-base-neutral80);

      ${respond(`max-width: 563px;`, 95)}
    }

    &__icon {
      width: ${iconSize};
      height: ${iconSize};
      margin-right: 12px;

      > .manicon-svg {
        position: relative;
        flex-shrink: 0;
        color: var(--color-base-neutral45);
      }
    }

    &__hero {
      grid-area: image;
      width: ${heroMaxHeight};
      height: ${heroMaxHeight};
      object-fit: cover;
      object-position: center;

      &--wide {
        width: 100%;
      }

      &--full {
        /* Break the full bleed hero out of the container so it spans the
        // full width of the page. */
        position: relative;
        right: 50%;
        left: 50%;
        width: 100vw;
        margin-top: -60px;
        margin-bottom: 10px;
        margin-left: -50vw;

        ${respond(
          `
            position: static;
            margin-right: calc(-100vw / 2 + ${containerWidth.inner} / 2);
            margin-left: calc(-100vw / 2 + ${containerWidth.inner} / 2);
          `,
          containerWidth.full
        )}
      }
    }
  }
`;
