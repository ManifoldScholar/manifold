import { respond } from "theme/styles/mixins";

export default `
  .project-thumb-placeholder {
    &--mobile {
      ${respond(`display: none;`, 75)}
    }

    &--desktop {
      display: none;
      ${respond(`display: block;`, 75)}
    }

    &--primary {
      .project-thumb-placeholder__tile {
        fill: var(--color-accent-primary-extra-pale);
      }
    }

    &--secondary {
      .project-thumb-placeholder__tile {
        fill: var(--color-base-neutral10);
      }
    }

    &--tertiary {
      .project-thumb-placeholder__tile {
        fill: var(--color-base-blue20);
      }
    }

    &--quaternary {
      .project-thumb-placeholder__tile {
        fill: var(--color-base-orange20);
      }
    }

    &--quinary {
      .project-thumb-placeholder__tile {
        fill: var(--color-base-violet20);
      }
    }

    &--outlined {
      .project-thumb-placeholder__tile {
        fill: transparent;
      }

      .project-thumb-placeholder__illustration {
        .backend &,
        .project-hero--dark & {
          stroke: var(--color-base-neutral50);
        }
      }
    }

    &__tile {
      fill: var(--color-base-neutral-white);
    }

    &__illustration {
      stroke: var(--color-base-neutral75);

      .backend &,
      .project-hero--dark & {
        stroke: var(--color-base-neutral90);
      }
    }

    &__frame {
      stroke: var(--color-base-neutral75);

      .backend &,
      .project-hero--dark & {
        stroke: var(--color-base-neutral50);
      }
    }
  }
`;
