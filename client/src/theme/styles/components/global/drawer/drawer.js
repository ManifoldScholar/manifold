import {
  defaultTransitionProps,
  respond,
  reactSlideTransition
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export default `
  .drawer {
    position: fixed;
    bottom: 0;
    width: 100%;
    overflow: auto;
    background-color: var(--drawer-bg-color);
    transition: transform ${defaultTransitionProps};

    &--backend,
    &--frontend {
      &.drawer--pos-default {
        top: var(--header-height, 82px);
      }
    }

    &--reader {
      &.drawer--pos-default {
        top: var(--reader-header-height);
      }
    }

    &--pos-overlay {
      top: 0;
    }

    &--right {
      ${reactSlideTransition("right", "&", "drawer")}
      right: 0;
      left: auto;
    }

    &--left {
      ${reactSlideTransition("left", "&", "drawer")}
      right: auto;
      left: 0;
    }

    &--default {
      ${respond(`width: 400px;`, 65)}
      ${respond(`width: 555px;`, 90)}
    }

    &--wide {
      ${respond(`width: 555px;`, 75)}
      ${respond(`width: 860px;`, 120)}
    }

    &--authoring {
      max-width: 800px;
      width: 100%;
    }

    &--flexible {
      ${respond(
        `width: auto;
        max-width: 75%;`,
        75
      )}

      ${respond(
        `max-width: 1024px;`,
        `${(parseInt(breakpoints[95], 10) * 4) / 3}px`
      )}
      ${respond(
        `width: calc((100vw - var(--container-width-inner) / 2));`,
        `${parseInt(breakpoints[120], 10) + 1000}px`
      )}
    }

    &--pad-default,
    &--pad-large,
    &--pad-authoring {
      padding: 20px var(--container-padding-inline-responsive) 33px;
    }

    &--pad-default {
      ${respond(`padding: 33px 48px;`, 90)}
    }

    &--pad-large {
      ${respond(`padding: 33px 48px;`, 65)}
      ${respond(`padding: 33px 156px 66px 98px;`, 90)}
      ${respond(
        `padding: 33px 70px;`,
        `${parseInt(breakpoints[120], 10) + 1000}px`
      )}
    }

    &--pad-authoring {
      ${respond(`padding: 33px 70px;`, 65)}
    }

    .utility-primary {
      color: var(--color-base-neutral-white);
    }

    .form-secondary .form-select {
      width: 100%;
    }

    .actions {
      margin-top: 40px;

      ${respond(`margin-top: 60px;`, 95)}
    }
  }
`;
