import { utilityPrimary, respond } from "theme/styles/mixins";

export default `
  .resource-slide-figure {
    --focus-color: var(--color-interaction-light);
    --hover-color: var(--color-interaction-light);

    position: relative;
    display: flex;
    width: 100%;
    height: 52vw;
    min-height: 350px;
    max-height: 52vh;
    overflow: hidden;
    color: var(--color-neutral-text-extra-light);
    background-color: var(--color-base-neutral-black);

    figure {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      opacity: 1;
    }

    /* Most resource heroes are height constrained. */
    /* Interactive ones are not. */
    &.resource-slide-interactive {
      display: flex;
      overflow: visible;
      background-color: inherit;

      figure {
        position: relative;
        height: auto;
        overflow: visible;
      }
    }

    /* Transition classes */
    .slide-left-enter figure {
      transform: translate3d(100%, 0, 0);
    }

    .slide-left-enter-active figure {
      transition: transform 0.4s var(--transition-timing-function);
      transform: translate3d(0, 0, 0);
    }

    .slide-left-exit figure {
      transform: translate3d(0, 0, 0);
    }

    .slide-left-exit-active figure {
      transition: transform 0.4s var(--transition-timing-function);
      transform: translate3d(-100%, 0, 0);
    }

    .slide-right-enter figure {
      transform: translate3d(-100%, 0, 0);
    }

    .slide-right-enter-active figure {
      transition: transform 0.4s var(--transition-timing-function);
      transform: translate3d(0, 0, 0);
    }

    .slide-right-exit figure {
      transform: translate3d(0, 0, 0);
    }

    .slide-right-exit-active figure {
      transition: transform 0.4s var(--transition-timing-function);
      transform: translate3d(100%, 0, 0);
    }

    .figure-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--color-base-neutral-black);
      object-fit: contain;
    }

    .figure-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-base-neutral-black);
      }
    }

    .figure-interactive {
      flex: 1;
      height: 100%;
      background: var(--color-base-neutral-white);

      iframe {
        width: 100%;
        min-height: 100%;
        border: 0;
      }
    }

    .figure-default {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      background-position: 50% 50%;
      background-size: cover;

      .resource-info {
        padding: 20px 60px;
        margin: auto;
        text-align: center;

        &.with-background {
          background-color: var(--color-base-neutral90);
          opacity: 0.75;
        }
      }

      .resource-type {
        ${utilityPrimary}
        display: block;
        padding-bottom: 6px;
        font-size: 21px;
        font-weight: var(--font-weight-regular);
      }

      .resource-date {
        ${utilityPrimary}
        font-size: 12px;
      }
    }

    .resource-preview-wrapper {
      &.focus-visible {
        border: 0;
        outline: 0;

        .zoom-indicator {
          color: var(--color-base-neutral95);
          background-color: var(--focus-color, var(--color-accent-primary));
        }
      }
    }

    &__resource-icon {
      margin-bottom: 4px;

      ${respond(
        `width: 21.34vw;
      height: 21.34vw;`,
        50
      )}

      ${respond(
        `width: 220px;
        height: 220px;`,
        120
      )}
    }
  }
`;
