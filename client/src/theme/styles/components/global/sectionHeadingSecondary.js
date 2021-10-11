export default `
  .section-heading-secondary {
    padding-bottom: 1.375em;
    font-size: 16px;

    .backend-dashboard & {
      padding-bottom: 2.625em;
    }

    .drawer-backend & {
      padding-bottom: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: var(--font-family-sans);
      margin: 0;
      font-size: 1em;
      color: var(--strong-color);
      text-transform: uppercase;
      letter-spacing: 0.125em;
    }

    .manicon-svg {
      width: 34px;
      height: 34px;
      margin-top: -3px;
      margin-right: 15px;
      color: var(--highlight-color);
    }
  }
`;
