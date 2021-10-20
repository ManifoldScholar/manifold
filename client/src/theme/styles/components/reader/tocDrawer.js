import { tocDrawer } from "theme/styles/variables/crossComponent";
import {
  headingSecondary,
  respond,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  fluidScale
} from "theme/styles/mixins";

const tocBasePadding = (nested = 0) =>
  `
    padding-right: ${fluidScale("30px", "20px")};
    padding-left: ${fluidScale(`${84 + nested}px`, `${30 + nested}px`)};
  `;

export default `
  .toc-drawer {
    ${tocBasePadding()}
    
    .drawer {
      width: ${tocDrawer.width};
      max-width: 90vw;
      background-color: var(--color-base-neutral10);
    }

    .no-scroll.overlay & {
      overflow: hidden;
    }

    .toc-empty {
      ${headingSecondary}
      padding: 50px 40px;
      margin: 0;
      font-style: italic;

      ${respond(`padding: 60px 85px;`, 50)}
    }

    hr {
      margin: 0;
      border-top: 1px solid var(--color-base-neutral40);
    }

    .toc-footer {
      display: block;

      &__button {
        ${buttonUnstyled}
        display: flex;
        align-items: center;
        width: 100%;
        padding: 16.362px ${tocDrawer.baseInlineEndPadding} 16.362px
          ${tocDrawer.baseInlineStartPadding};
        margin-top: 15px;
        color: var(--color-neutral-text-dark);
        text-decoration: none;
        transition: background-color ${defaultTransitionProps};

        &:hover,
        &:focus-visible {
          background-color: var(--color-base-neutral30);
          outline: 0;
        }

        ${respond(
          `padding-top: 17px;
        padding-bottom: 17px;`,
          50
        )}
      }

      &__icon {
        position: relative;
        top: 1px;
      }

      &__text {
        ${utilityPrimary}
        margin: 0 0 0 1em;
        font-size: 14px;
      }
    }
  }
`;
