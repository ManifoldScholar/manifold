import { baseColors } from "theme/styles/variables/appearance";
import { respond } from "theme/styles/mixins";

const Color = require("color");

const bgColorBase = Color(baseColors.neutral90);

export default `
  .icon-thumbnail-primary {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    text-align: center;
    background-color: var(--box-medium-bg-color);

    &.bg-image {
      --color: var(--color-base-neutral-white);

      background-position: 0 0;
      background-size: cover;
      transition: color var(--transition-duration-default) var(--transition-timing-function);

      &::before {
        position: absolute;
        width: 100%;
        height: 100%;
        content: "";
        background-color: ${bgColorBase.fade(0.3)};
      }
    }

    &.title {
      .wrapper {
        padding: 16px 16px 18px;

        ${respond(`padding: 22px 20px 36px;`, 120)}
      }

      .icon-thumbnail-type {
        font-size: 12px;
      }

      .icon-thumbnail-icon {
        padding: 10px 0 6px;

        svg,
        .collectable-placeholder-content {
          width: 48px;
          height: 48px;
        }

        ${respond(
          `
            padding: 14px 0;

            svg,
            .collectable-placeholder-content {
              width: 64px;
              height: 64px;
            }
          `,
          60
        )}
      }
    }

    &.icon-only {
      background-color: transparent;

      &.bg-image {
        &::before {
          display: none;
        }

        .icon-thumbnail-icon {
          display: none;
        }

        .wrapper {
          padding-top: 50px;
        }
      }

      // Override padding for standard thumbnail
      .wrapper {
        padding: 0;
      }

      .icon-thumbnail-icon {
        width: 100%;
        padding: 0;
      }
    }

    &.minimal:not(.preview) {
      background: transparent;
    }

    &.minimal {
      &.preview {
        width: 37px;
        height: 37px;
        overflow: hidden;

        .icon-thumbnail-icon {
          width: 100%;
          height: 37px;

          svg {
            width: 24px;
            height: 24px;
          }
        }
      }

      &.bg-image {
        .icon-thumbnail-icon {
          display: none;
        }

        &::before {
          background-color: var(--hover-color);
          opacity: 0;
        }
      }

      .icon-thumbnail-image {
        position: relative;
        display: inline-block;

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: "";
          transition: opacity var(--transition-duration-default) ease-out;
        }

        img {
          display: block;
          width: auto;
          height: 50px;
        }
      }

      .icon-thumbnail-icon {
        display: flex;
        width: 80px;
        height: 50px;
        padding: 0;
        margin: 0 0 0 auto;
        color: var(--strong-color);
        text-align: center;
        background-color: var(--box-medium-bg-color);

        svg {
          width: 30px;
          height: 30px;
          margin: auto;
        }
      }

      .wrapper {
        padding: 0;
        padding-bottom: 1em;

        .viewer-list & {
          padding-bottom: 0.5em;
        }
      }

      .icon-thumbnail-title {
        @include templateHead;
        padding-top: 8px;
        font-size: 14px;
        font-family: var(--font-family-heading);
        font-weight: var(--font-weight-light);
        hyphens: none;
        line-height: 1.1;
      }
    }

    &.right {
      text-align: right;
    }

    .wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 24px 0 30px;

      ${respond(`padding: 30px 0 37px;`, 40)}
      ${respond(`padding: 35px 0 43px;`, 85)}
    }

    .icon-thumbnail-type {
      font-size: 13px;
      font-family: var(--font-family-heading);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.096em;

      .notation-viewer & {
        font-size: 0;
      }
    }

    .icon-thumbnail-title {
      margin: 0;
      font-size: 17px;
      font-family: var(--font-family-heading);
      font-weight: var(--font-weight-medium);
      hyphens: none;
    }

    .icon-thumbnail-icon {
      display: block;
      padding: 18px 0 0;
      margin: 0 auto;
    }
  }
`;
