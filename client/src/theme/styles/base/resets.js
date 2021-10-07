import { css } from "styled-components";
import { logicalWithFallback } from "@castiron/style-mixins";

// Resets
// --------------------

export default css`
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default padding */
  html,
  body,
  margin,
  ul,
  ol {
    padding: 0;
  }

  /* Remove default margin */
  html,
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Set core root defaults */
  html {
    scroll-behavior: smooth;
    // Set the base font size here, which will correspond to 1em inside <body>
    font-size: 100%;
  }

  /* Set core body defaults */
  body {
    ${logicalWithFallback({ "min-block-size": "100vh" })}
    text-rendering: geometricPrecision;
  }

  /* Remove list styles on ul, ol elements with a class attribute */
  ul[class],
  ol[class] {
    list-style: none;
  }

  /* Make images easier to work with */
  img,
  picture {
    display: block;
    ${logicalWithFallback({
      "inline-size": "100%",
      "block-size": "auto"
    })}
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    text-rendering: inherit;
  }

  button {
    margin: 0;
  }

  fieldset {
    margin: 0;
    padding: 0;
    border: none;
  }

  legend {
    padding: 0;
  }

  /* Remove all animations for people that prefer not to see them */
  /* stylelint-disable scss/media-feature-value-dollar-variable, declaration-no-important */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
    }
  }

  /* Set svg fill to current color */
  svg {
    fill: currentColor;
  }

  /* Reset common details gotchas */
  details summary {
    cursor: pointer;

    &::marker {
      content: none;
    }

    &::-webkit-details-marker {
      display: none;
    }

    > * {
      display: inline;
    }
  }

  figure,
  p {
    margin: 0;
  }

  a {
    color: inherit;
  }
`;
