import {
  drawerPadding,
  fluidScale,
  drawerIndent,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
  .annotation-selection {
    &__text-container {
      ${drawerPadding("padding-right")}
      ${drawerPadding("padding-left")}
      font-size: ${fluidScale("18px", "16px")};
      font-family: var(--font-family-sans);
      line-height: 1.3;
      color: var(--strong-color);
      word-wrap: break-word;
      transition: background-color ${defaultTransitionProps};

      & * + p,
      & * + div[data-mathml="true"] {
        margin-block-start: 1em;
      }

      & li {
        list-style-position: inside;
      }

      & img {
        height: 150px;
        margin-inline: auto;
        margin-block: 1em;
      }

      &--dark {
        padding-top: ${fluidScale("31px", "23px")};
        padding-bottom: ${fluidScale("25px", "23px")};
        background-color: var(--box-medium-bg-color);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;

        &.annotation-selection__text-container--hovering {
          background-color: var(--box-strong-bg-color);
        }
      }

      &--light {
        padding-top: ${fluidScale("41px", "30px")};
        padding-bottom: ${fluidScale("34px", "26px")};
        background-color: var(--box-bg-color);

        &.annotation-selection__text-container--hovering {
          background-color: var(--box-medium-bg-color);
        }
      }

      &--rounded-corners {
        border-radius: var(--box-border-radius);
      }

      &--hovering {
        position: relative;

        .annotation-selection__arrow-icon {
          transform: translateX(20%);
        }
      }
    }

    &__highlight-text {
      width: 100%;
      line-height: 1.6;
      background-color: var(--color-accent-tertiary-pale);
    }

    &__container {
      ${drawerIndent("padding-left")}
      position: relative;
      padding-right: 0;
    }

    &__icon {
      position: absolute;
      top: 2px;
      left: 0;
      color: var(--highlight-color);

      &--flipped {
        transform: rotateX(180deg);
        transform: rotateX(180deg) translateZ(-1px);
      }
    }

    &__button {
      ${buttonUnstyled}
      ${utilityPrimary}
      ${drawerIndent("margin-left")}
      display: block;
      margin-top: 20px;
      font-size: 13px;
      color: var(--hover-color);
    }

    &__button-absolute {
      ${buttonUnstyled}
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &__source-summary {
      padding-top: 10px;
    }

    &__source-summary-link {
      display: flex;
      color: var(--color);
      text-decoration: none;

      &:hover {
        color: inherit;
      }
    }

    &__source-summary-text {
      font-family: var(--font-family-copy);
      font-size: ${fluidScale("16px", "14px")};
    }

    &__arrow-icon {
      position: relative;
      top: -2px;
      flex-shrink: 0;
      margin-left: 12px;
      transition: transform ${defaultTransitionProps};
    }

    &__action-buttons {
      position: relative;
    }
  }
`;
