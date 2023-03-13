import { logicalWithFallback } from "@castiron/style-mixins";

/**
 * Resets
 *
 * A mix of Normalize.css v8 and @castiron/global-styles
 */

export default `
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
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Set core root defaults */
  html {
    scroll-behavior: smooth;
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
      "max-inline-size": "100%",
      "block-size": "auto"
    })}
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select,
  optgroup {
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    text-rendering: inherit;
  }

  /* Remove the inheritance of text transform in Edge, Firefox, and IE */
  button,
  select {
    text-transform: none;
  }

  input {
    line-height: normal;
  }

  button {
    margin: 0;
    cursor: pointer;
  }

  fieldset {
    margin: 0;
    padding: 0;
    border: none;
  }

  legend {
    padding: 0;
  }

  /**
  * Correct the cursor style of increment and decrement buttons in Chrome.
  */

  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }

  /**
  * 1. Correct the odd appearance in Chrome and Safari.
  * 2. Correct the outline style in Safari.
  */

  [type="search"] {
    -webkit-appearance: textfield; /* 1 */
    outline-offset: -2px; /* 2 */
  }

  /**
  * Remove the inner padding in Chrome and Safari on macOS.
  */

  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  /**
  * 1. Correct the inability to style clickable types in iOS and Safari.
  * 2. Change font properties to inherit in Safari.
  */

  ::-webkit-file-upload-button {
    -webkit-appearance: button; /* 1 */
    font: inherit; /* 2 */
  }

  /* Remove all animations for people that prefer not to see them */
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

  /**
  * 1. Correct the inheritance and scaling of font size in all browsers.
  * 2. Correct the odd em font sizing in all browsers.
  */

  pre {
    font-family: monospace, monospace; /* 1 */
    font-size: 1em; /* 2 */
  }

  /**
  * 1. Correct the inheritance and scaling of font size in all browsers.
  * 2. Correct the odd em font sizing in all browsers.
  */

  code,
  kbd,
  samp {
    font-family: monospace, monospace; /* 1 */
    font-size: 1em; /* 2 */
  }

  /**
  * Add the correct font size in all browsers.
  */
  small {
    font-size: 80%;
  }

  /**
  * Prevent sub and sup elements from affecting the line height in
  * all browsers.
  */
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
  }
`;
