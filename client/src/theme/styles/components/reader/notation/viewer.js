import { readerContainerWidths } from "theme/styles/utility/layout";
import {
  listUnstyled,
  respond,
  defaultHoverStyle,
  defaultTransitionProps,
  buttonUnstyled
} from "theme/styles/mixins";

const widths = readerContainerWidths
  .map(
    (width, i) => `
    &.container-width-${i} {
      right: calc((100% - ${width}) / 2 + ${width});

      /* Responsively show/hide notation viewer list */
      .viewer-list {
        ${respond(`display: block;`, `${parseInt(width, 10) + 392}px`)}
      }

      /* Responsively show/hide notation footer preview */
      .notation-preview-footer {
        ${respond(`display: none;`, `${parseInt(width, 10) + 392}px`)}
      }
    }
  `
  )
  .join("");

const resourceOverflowFade = `
      &::before {
        position: absolute;
        z-index: 5;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        content: "";
        box-shadow: inset 0 -14px 10px -2px var(--color-base-neutral-white);
        transition: box-shadow ${defaultTransitionProps};

        .scheme-dark & {
          box-shadow: inset 0 -14px 10px -2px var(--color-base-neutral90);
        }
      }
    `;

export default `
  .notation-viewer {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: var(--color-accent-primary-pale);

    ${widths}

    .viewer-list {
      ${listUnstyled}
      position: absolute;
      top: 0;
      right: 3vw;
      /* There is a bit of javascript in the Reader/Notation/Viewer/List component that relies on the following display: none property. If the viewer-list is not visible, the List component will automatically set the active notation as the user scrolls, to populate the preview. We detect the visibility of the viewer-list by checking for an offsetParent, which is null if the element is set to display: none. In short, if you change hows this element is hidden/visible, you may need to revisit that logic as well. I realize the separation of concerns here isn't ideal, but it's worth it to maintain simplicity around how we track which notation is active. --ZD */
      display: none;
      height: 100%;

      ${respond(`right: 45px;`, 120)}

      .notation-single-link {
        display: block;
        text-decoration: none;

        .image-overlay {
          background-color: var(--hover-color);
          opacity: 0;
        }

        &:hover,
        &:focus,
        &.highlighted,
        .highlighted & {
          --Thumbnail-ImageOverlay-opacity: 0.5;
          --Thumbnail-Icon-background-color: var(--hover-color);

          outline: 0;
        }
      }
    }
  }

  .notation-wrapper {
    position: absolute;
    right: 0;
  }

  .notation-preview-fader {
    position: absolute;
    right: 0;
    transition: right 0.5s var(--transition-timing-function) 0.1s,
      opacity 0.5s var(--transition-timing-function);

    &.transition-out {
      right: 20px;
      opacity: 0;
    }

    &.transition-in {
      right: 0;
      opacity: 1;
    }
  }

  .notation-preview-single {
    width: 160px;
    text-decoration: none;

    &.highlight-enter {
      opacity: 0.01;
    }

    &.highlight-enter-active {
      opacity: 1;

      figure {
        transition: opacity ${defaultTransitionProps};
      }
    }

    &.highlight-exit {
      --Thumbnail-Title-opacity: 0;

      opacity: 1;
    }

    &.highlight-exit-active {
      opacity: 0.01;

      figure {
        transition: opacity ${defaultTransitionProps};
      }
    }

    .notation-preview-overflow {
      ${resourceOverflowFade}
      height: 100%;
      overflow: hidden;
    }

    .notation-delete {
      ${buttonUnstyled}
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
      width: 17px;
      height: 17px;
      color: var(--color-neutral-text-extra-dark);
      cursor: pointer;
      background-color: var(--color-base-neutral40);
      transition: background-color ${defaultTransitionProps};

      &:hover,
      &.focus-visible {
        background-color: var(--color-notification-error-light);
        outline: 0;
      }

      &__icon {
        vertical-align: top;
      }
    }
  }

  .notation-preview-group {
    overflow: hidden;
    text-align: right;

    .group-active-title {
      font-family: var(--font-family-heading);
      margin: 0;
      font-size: 14px;
      font-weight: var(--font-weight-light);
      line-height: 1.3;
      transition: color ${defaultTransitionProps};

      a {
        text-decoration: none;

        &:hover {
          ${defaultHoverStyle}
        }
      }

      &.highlighted {
        a {
          ${defaultHoverStyle}
        }
      }
    }

    .group-thumbnails {
      ${listUnstyled}
      position: relative;
      display: inline-block;
      max-height: 80px;
      margin-left: -4px;
      overflow: hidden;
      text-align: right;

      &.overflow {
        ${resourceOverflowFade}
      }

      li {
        display: inline-block;
        padding-left: 4px;
        margin-bottom: 4px;
        vertical-align: top;
      }

      .group-thumbnail {
        position: relative;
        cursor: pointer;

        &.highlighted,
        a.focus-visible {
          outline: 0;
        }
      }
    }

    .group-highlighted-notation-wrapper {
      position: relative;
      display: inline-block;
      width: 160px;
    }

    .group-highlighted-resource {
      position: absolute;

      .notation-preview-single {
        position: static;
        display: inline-block;
        width: 160px;
      }
    }
  }
`;
