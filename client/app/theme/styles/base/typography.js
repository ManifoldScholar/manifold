export default `
  html {
    font-size: 22px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-decoration-thickness: from-font;
    text-underline-position: from-font;
  }

  body {
    font-size: var(--font-size-root);
    font-weight: var(--font-size-regular);
    hyphens: auto;
    line-height: var(--line-height);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  a {
    text-decoration-thickness: inherit;
  }

  a,
  span,
  div {
    text-underline-offset: 1px;
  }

  mtext {
    font-family: Latin Modern Roman, LMRoman12, STIX Two Text;
  }
  math {
    font-family: Latin Modern Math, STIX Two Math;
    text-underline-position: under;
  }

  .font-sans-serif,
  .annotation-selection__text-container {
    mtext {
      font-family: Fira Math, STIX Two Text;
    }
    math {
      font-family: Fira Math, STIX Two Math;
    }
  }

`;
