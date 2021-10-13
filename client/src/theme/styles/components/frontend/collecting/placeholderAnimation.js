import { respond, aspectRatio } from "theme/styles/mixins";

const maxWidth = `640px`;
const hideBreakpoint = `675px`;
const collectingIconSize = `24px`;
const animationDuration = 750;
const animationDelay = animationDuration / 2;
const animationEasing = `ease-out`;
const blockArray = `1, 2, 3, 4, 5`;

export default `
  .collecting-placeholder-animation {
    --block-opacity: 0;
    --type-icon-color: var(--color);
    --collecting-icon-foreground-color: var(--color-base-neutral-white);
    --collecting-icon-background-color: var(--color-base-neutral70);

    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 30px;
    max-width: ${maxWidth};
    margin-right: auto;
    margin-left: auto;
    color: var(--strong-color);
    opacity: 0;

    ${respond(`display: none;`, hideBreakpoint, "max")}

    &:not(:first-child) {
      margin-top: min(4.882vw, 50px);
    }

    &--animate {
      --block-opacity: 1;
      --type-icon-color: var(--strong-color);
      --collecting-icon-foreground-color: var(--strong-color);
      --collecting-icon-background-color: var(--color-base-blue45);

      opacity: 1;

      /* > * {
        @each $block in $_block-array {
          &:nth-child(#{$block}) {
            $content-start-index: $block + length($_block-array) - 2;
            // stagger block skeleton fade-in
            --skeleton-delay: #{$_animation-delay *
              $block -
              $_animation-delay}ms;
            // stagger collecting icon fill and block title transition, and time to start when third skeleton is faded in
            --content-delay: #{$_animation-delay *
              $content-start-index -
              $_animation-delay}ms;
          }
        }
      } */
    }

    &__block {
      display: grid;
      grid-template-rows:
        auto calc(${collectingIconSize} / 2) calc(${collectingIconSize} / 2)
        1fr;
      grid-template-columns: 100%;
      opacity: var(--block-opacity);
      transition: opacity ${animationDuration}ms ${animationEasing};
      transition-delay: var(--skeleton-delay);
    }

    &__type-icon {
      ${aspectRatio(1, 1)}
      display: flex;
      grid-row: 1 / 3;
      grid-column: 1;
      align-items: center;
      justify-content: center;
      color: var(--type-icon-color);
      background-color: var(--box-strong-bg-color);
      border-radius: var(--box-border-radius);
      transition: color ${animationDuration}ms ${animationEasing};
      transition-delay: var(--content-delay);

      svg {
        width: responsive-size(64px, 850px);
        height: responsive-size(64px, 850px);
      }
    }

    &__collecting-icon {
      grid-row: 2 / 4;
      grid-column: 1;
    }

    &__block-title {
      grid-row: 4 / -1;
      grid-column: 1;
      padding-top: 12px;
      line-height: 1.188;
    }

    .icon-star-fill {
      &__foreground {
        fill: var(--collecting-icon-foreground-color);
        transition: fill ${animationDuration}ms ${animationEasing};
        transition-delay: var(--content-delay);
      }

      &__background {
        fill: var(--collecting-icon-background-color);
        transition: fill ${animationDuration}ms ${animationEasing};
        transition-delay: var(--content-delay);
      }
    }
  }
`;
