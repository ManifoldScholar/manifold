import {
  defaultTransitionProps,
  defaultHoverStyle,
  respond,
  fluidScale
} from "theme/styles/mixins";
import { ZOOM_BREAKPOINT } from "../readerHeader";

export default `
  /* Search Menu button and panel global styles (see header styles for context specific styles) */
  .button-search {
    height: 100%;
    padding: 0;
    color: var(--header-foreground-color);
    vertical-align: middle;
    background: transparent;
    border: 0;
    border-radius: 0;
    outline: none;
    appearance: none;

    .scheme-dark & {
      --header-foreground-color: var(--color);
    }

    .header-app & {
      transition: color ${defaultTransitionProps};

      &.button-active {
        ${defaultHoverStyle}
        outline: 0;
      }
    }
  }

  .search-menu {
    --focus-color: var(--color-neutral-ui-dark);

    position: absolute;
    right: calc(-1 * var(--container-padding-inline-responsive-global));
    width: 100vw;
    max-width: 100vw;
    white-space: nowrap;
    background-color: var(--color-base-neutral10);
    max-block-size: calc(100vh - var(--reader-header-height) * 2);
    overflow: auto;

    ${respond(
      `max-block-size: calc(100vh - var(--reader-header-height));`,
      ZOOM_BREAKPOINT
    )}

    .header-app & {
      ${respond(`padding: 20px 24px 22px;`, 40)}
    }

    .reader-header & {
      width: auto;
      padding: 20px ${fluidScale("30px", "18px")} ${fluidScale("19px", "12px")};
    }

    ${respond(`width: auto;`, 70)}

    ${respond(`right: calc(-1 * var(--container-padding-inline-full));`, 120)}
  }
`;
