import { resetWordWrap, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .reader-window {
    ${resetWordWrap}
    padding: calc(60px + var(--reader-header-height, 0px)) 0 60px;
    overflow: hidden;
    color: var(--reader-color);
    background-color: var(--bg-color);
    transition: background-color ${defaultTransitionProps};

    .reader-debug {
      position: relative;
      top: -60px;
    }
  }

  .text-section {
    container: text-section / inline-size;
    font-family: var(--font-family-copy);
    font-weight: var(--font-weight-regular);
    line-height: 1.761;

    --selection-bg-color: var(--color-base-yellow20);

    .high-contrast &  {
      --selection-bg-color: var(--color-base-yellow75);
    }

    &.scheme-dark,
    .scheme-dark & {
      --selection-bg-color: var(--color-base-yellow75);

      .high-contrast &  {
        --selection-bg-color: var(--color-base-yellow20);
      }
    }

    *::selection,
    .annotation-locked-selected {
      background-color: var(--selection-bg-color) !important;

      .high-contrast &  {
        color: var(--background-color);
      }
    }

    *::target-text {
      background-color: var(--color-base-violet20);

      .high-contrast &  {
        color: var(--background-color);
        background-color: var(--color-base-violet75);
      }

      .scheme-dark & {
        background-color: var(--color-base-violet75);

        .high-contrast &  {
          background-color: var(--color-base-violet20);
        }
      }
    }

    &.font-sans-serif {
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-light);
    }

    a {
      color: var(--hover-color);
    }

    .cn {
      font-size: 1.2em;
    }

    h1 {
      font-size: 1.6em;
      font-weight: var(--font-weight-semibold);
      line-height: 1.45;
    }

    h2 {
      font-size: 1.3em;
      font-weight: var(--font-weight-semibold);
      line-height: 1.45;
    }

    h3 {
      font-size: 1.1em;
      font-weight: var(--font-weight-semibold);
      line-height: 1.45;
    }

    h4 {
      font-size: 1em;
      font-weight: var(--font-weight-semibold);
      line-height: 1.45;
    }

    img {
      max-width: 100%;
    }

    pre {
      font-size: 0.7em;
    }

    p {
      margin: 1em 0;
    }

    table {
      margin: 1em 0;

      tr th {
        padding-right: 1em;
      }
    }

    dl {
      dt {
        font-weight: 700;
      }
    }

    /* revert default list style to specification in UA stylesheet */
    ul[class],
    ol[class] {
      list-style: revert;
    }
  }

  #text-section-interactive-region {
    scroll-margin-block-start: calc(60px + var(--reader-header-height, 0px));
  }
`;
