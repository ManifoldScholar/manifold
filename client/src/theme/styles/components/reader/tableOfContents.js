import {
  respond,
  listUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";
import { tocDrawer } from "theme/styles/variables/crossComponent";

const paddingIncrement = "20px";
const levels = [1, 2, 3, 4, 5];
const toggleWidth = "24px";
const togglePadding = "12px";
const inlineEndPadding = `calc(${tocDrawer.baseInlineEndPadding} + calc(${toggleWidth} + ${togglePadding})
)`;

const levelClasses = levels
  .map(
    level => `
      &--depth-${level} {
        --toc-inline-start-padding: calc(
          ${tocDrawer.baseInlineStartPadding} + ${paddingIncrement} * ${level}
        );
      }
    `
  )
  .join("");

export default `
  .table-of-contents {
    font-family: var(--font-family-heading);
    padding-top: 10px;
    overflow: hidden;
    color: var(--strong-color);
    background-color: var(--box-bg-color);

    &__list {
      --toc-inline-start-padding: ${tocDrawer.baseInlineStartPadding};
      --toc-font-size: 18px;

      ${respond(`--toc-font-size: 22px;`, 50)}

      &:not(.table-of-contents__list--depth-0) {
        --toc-font-size: 16px;

        ${respond(`--toc-font-size: 18px;`, 50)}
      }

      ${levelClasses}

      ${listUnstyled}
      font-size: var(--toc-font-size);
    }

    &__item-inner {
      position: relative;
      display: flex;
    }

    &__collecting-toggle {
      position: absolute;
      top: 42%;
      right: calc(${tocDrawer.baseInlineEndPadding} + 2%);
      transform: translateY(-50%);

      &--hidden {
        visibility: hidden;
        opacity: 0;
      }
    }

    &__link {
      flex-grow: 1;
      width: 100%;
      padding: 0.773em ${inlineEndPadding} 0.773em
        var(--toc-inline-start-padding);
      hyphens: none;
      line-height: 1.2;
      text-decoration: none;
      transition: background-color ${defaultTransitionProps};

      &:hover,
      &:focus-visible {
        color: inherit;
        outline: 0;
      }

      &--active {
        background-color: var(--box-x-strong-bg-color);
      }
    }
  }
`;
