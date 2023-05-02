import { resetWordWrap, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .reader-window {
    ${resetWordWrap}
    padding: 60px 0;
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
    font-family: var(--font-family-copy);
    font-weight: var(--font-weight-regular);
    line-height: 1.761;

    --selection-bg-color: var(--color-base-yellow20);

    &.scheme-dark,
    .scheme-dark & {
      --selection-bg-color: var(--color-base-yellow75);
    }

    *::selection,
    .annotation-locked-selected {
      background-color: var(--selection-bg-color);
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
      margin-right: auto;
      margin-left: auto;
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

    /* Link with notation marker cube */
    .notation-marker {
      cursor: pointer;
    }
  }
`;
