import {
  respond,
  headingPrimary,
  headingPrimaryFontSizing,
  subtitlePrimary,
  overlayCopy,
  utilityPrimary
} from "theme/styles/mixins";

export default `
  .section-heading {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 30px;
    ${headingPrimaryFontSizing}

    ${respond(
      `
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    `,
      95
    )}

  .main {
      display: flex;
      align-items: flex-start;
      padding-right: 25px;

      .body {
        font-size: 16px;

        .title {
          ${headingPrimary}
          margin-bottom: 2px;
          color: var(--strong-color);
        }

        .date {
          ${subtitlePrimary}
          font-size: 14px;
        }
      }
    }

    .overlay-copy {
      ${overlayCopy}
    }

    .login-links {
      ${overlayCopy}
      font-style: italic;

      a {
        color: var(--color-base-neutral50);

        + a {
          margin-left: 14px;
        }
      }
    }

    .utility {
      margin-top: 20px;

      ${respond(`margin-top: 0;`, 95)}

      .right {
        ${respond(
          `
          position: absolute;
          top: 0;
          right: 0;
        `,
          95
        )}

        .button-primary {
          margin-bottom: 20px;

          ${respond(`margin-bottom: 0;`, 95)}
        }
      }
    }
  }

  .sub-section-heading {
    ${utilityPrimary}
    padding: 1.143em 2.143em 1.357em;
    margin-top: 0;
    margin-bottom: 2.929em;
    font-size: 14px;
    color: var(--color-accent-primary-dark);
    background-color: var(--color-base-neutral05);
  }
`;
