import { breakpoints } from "theme/styles/variables/media";
import {
  listUnstyled,
  respond,
  panelRoundedDark,
  defaultTransitionProps,
  rgba,
  transparentize,
  fluidShrink,
  fluidScale
} from "theme/styles/mixins";

const breakpoint = breakpoints[60];
const maxGap = "30px";

export default `
  /* Nav wrapping a ul */
  .resource-collections-list {
    ul {
      ${listUnstyled}
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-gap: ${fluidShrink(maxGap, breakpoint)};

      ${respond(
        `grid-template-columns: repeat(2, minmax(0, 1fr));`,
        breakpoint
      )}
    }

    a,
    .cover-placeholder {
      --hover-color: var(--color-interaction-light);

      ${panelRoundedDark}
      display: flex;
      width: 100%;
      height: 100%;
      padding-top: 107px;
      color: var(--color-base-neutral-white);
      text-decoration: none;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: cover;
      transition: color ${defaultTransitionProps},
        box-shadow ${defaultTransitionProps};

      ${respond(`padding-top: 160px;`, 80)}

      &[href]:hover,
      &[href]:focus-visible {
        color: var(--hover-color);
        outline: 0;
        box-shadow: 0 20px 30px 2px ${rgba("neutralBlack", 0.13)};
      }
    }

    .cover-placeholder {
      background-color: var(--color-base-neutral20);
    }

    .title-overlay {
      display: flex;
      justify-content: space-between;
      width: 100%;
      hyphens: none;
      background-color: ${transparentize("neutralBlack", 0.2)};
      border-radius: 0 0 8px 8px;
      transition: background-color var(--transition-duration-default) ease-out;

      ${respond(`flex-direction: row;`, 80)}

      &--placeholder {
        min-height: 57px;
        background-color: transparent;

        ${respond(`min-height: 100px;`, 90)}

        .icon {
          color: var(--color-base-neutral40);
        }
      }
    }

    .collection-title,
    .icon {
      margin: 0;
    }

    .collection-title {
      font-family: var(--font-family-heading);
      flex-grow: 1;
      width: auto;
      height: auto;
      padding: ${fluidScale("20px 24px", "18px 16px")};
      font-size: ${fluidScale("18px", "20px")};
      font-weight: var(--font-weight-medium);
      hyphens: none;

      ${respond(`flex-grow: 1;`, 80)}
    }

    .icon {
      font-family: var(--font-family-heading);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      max-width: 100px;
      padding-right: 16px;
      font-size: 12px;
      text-align: center;

      ${respond(
        `padding: 18px 24px 18px 0;
              font-size: 14px;`,
        75
      )}

      ${respond(`transform: translateY(-5px);`, 90)}

      span {
        display: none;

        ${respond(
          `display: block;
              word-break: break-word;`,
          90
        )}
      }
    }
  }
`;
