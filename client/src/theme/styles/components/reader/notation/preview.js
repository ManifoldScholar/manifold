import {
  defaultTransitionProps,
  respond,
  defaultHoverStyle
} from "theme/styles/mixins";
import { containerPadding } from "theme/styles/variables/layout";

export default `
  .notation-preview-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-base-neutral-white);
    border-top: 1px solid var(--color-base-neutral50);
    /* This gets overwritten during a show/hide */
    transition: margin ${defaultTransitionProps};

    ${respond(`bottom: 0;`, 50)}

    &.notation-enter {
      bottom: -100px;
    }

    &.notation-enter-active {
      bottom: 44px;
      transition: bottom ${defaultTransitionProps};

      ${respond(`bottom: 0;`, 50)}
    }

    &.notation-exit {
      bottom: 44px;

      ${respond(`bottom: 0;`, 50)}
    }

    &.notation-exit-active {
      bottom: -100px;
      transition: bottom ${defaultTransitionProps};
    }

    .scheme-dark & {
      background-color: var(--color-base-neutral90);
    }

    &__link {
      display: block;
      text-decoration: none;

      &:hover,
      &.active,
      &:focus-visible {
        ${defaultHoverStyle}
        outline: 0;

        .icon-thumbnail-primary {
          background-color: var(--hover-color);

          &::after {
            opacity: 0.5;
          }

          svg {
            fill: var(--color-base-neutral-white);
          }
        }
      }
    }

    &__link-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 17px ${containerPadding.responsive};

      .scheme-dark & {
        color: var(--color-base-neutral-white);
      }
    }

    &__figure {
      display: flex;
      flex-grow: 2;

      .icon-thumbnail-primary {
        position: relative;
        min-width: 70px;
        max-width: 70px;
        height: 43px;
        background-color: var(--color-base-neutral10);
        transition: background-color ${defaultTransitionProps};

        &::after {
          position: absolute;
          display: none;
          width: 100%;
          height: 100%;
          content: "";
          background-color: var(--hover-color);
          opacity: 0;
          transition: opacity ${defaultTransitionProps};
        }

        &.icon-only.bg-image {
          &::after {
            display: block;
          }

          .wrapper {
            padding-top: 61.429%;
          }
        }

        .icon-thumbnail-icon {
          display: flex;

          svg {
            width: 30px;
            height: 30px;
            margin: auto;
            transition: fill ${defaultTransitionProps};
          }
        }
      }
    }

    &__figcaption {
      font-family: var(--font-family-heading);
      margin-top: -0.231em;
      margin-left: 10px;
      font-size: 13px;
      font-weight: var(--font-weight-light);
      letter-spacing: 0.06em;

      ${respond(`font-size: 16px;`, 60)}
    }

    &__cube-icon {
      margin-right: 0.375em;
      color: var(--hover-color);
    }

    &__caret-icon {
      color: var(--hover-color);
      transform: rotate(-90deg);
    }
  }
`;