import {
  respond,
  listUnstyled,
  defaultTransitionProps,
  rgba,
  defaultHoverStyle,
  fluidScale
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

const breakpoint = breakpoints[60];
const maxGap = "25px";
const minGap = "20px";
const itemMinWidth = "195px";

export default `.resource-thumbnail-list {
  ul {
    ${listUnstyled}
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: ${fluidScale(maxGap, minGap)};

    ${respond(
      `grid-template-columns: repeat(auto-fill, minmax(${itemMinWidth}, 1fr));`,
      breakpoint
    )}
  }

  a,
  .resource-link-placeholder {
    display: flex;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }

  a {
    .icon-thumbnail-primary {
      background-color: var(--card-bg-color, var(--color-base-neutral05));
      border-radius: var(--box-border-radius);
      transition:
        color ${defaultTransitionProps},
        box-shadow ${defaultTransitionProps};

      &.bg-image::before {
        border-radius: var(--box-border-radius);
      }
    }

    &:hover,
    &:focus-visible {
      outline: none;

      .icon-thumbnail-primary {
        ${defaultHoverStyle}
        box-shadow: 0 20px 30px 2px ${rgba("neutralBlack", 0.13)};
      }
    }
  }

  .resource-link-placeholder {
    .icon-thumbnail-primary {
      background-color: var(--color-base-neutral20);
      border-radius: var(--box-border-radius);
    }

    .wrapper {
      align-items: center;
      min-height: 132px;

      ${respond(`min-height: 160px;`, breakpoint)}
    }

    .icon-thumbnail-title {
      width: 100%;
    }

    svg {
      color: var(--color-base-neutral40);
    }
  }

  .bg-image {
    --hover-color: var(--color-accent-interaction-light);
  }
}
`;
