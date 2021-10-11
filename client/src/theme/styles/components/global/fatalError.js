import {
  buttonUnstyled,
  subtitlePrimary,
  darken,
  respond
} from "theme/styles/mixins";

export default `
  body.fatal-error-page {
    display: flex;
    flex-direction: column;

    #content {
      flex-grow: 1;
      min-height: 100vh;
    }
  }

  .fatal-error {
    min-height: 100%;
    border: 20px solid var(--error-color);

    .error-wrapper {
      padding: 10vh 4vh 4vh;
      vertical-align: middle;
    }

    .container {
      max-width: var(--container-width-focus);
      text-align: center;
    }

    &__stop-icon {
      margin-bottom: 20px;
      color: var(--error-color);
    }

    header {
      margin-bottom: 1.375em;
      font-size: 24px;

      ${respond(`font-size: 32px;`, 60)}

      h3 {
        margin: 0;
        font-size: 1em;
        font-family: var(--font-family-heading);
        font-weight: var(--font-weight-regular);
        line-height: 1.333;
        color: var(--color-base-neutral50);
      }
    }

    .error-description {
      h1 {
        font-size: 20px;
        font-family: var(--font-family-heading);
        font-weight: var(--font-weight-regular);
        color: var(--color-base-neutral90);

        ${respond(`font-size: 24px;`, 60)}

        .backend & {
          color: var(--color-base-neutral05);
        }
      }

      p {
        ${subtitlePrimary}
        font-size: 18px;
        line-height: 1.421;
        color: var(--color-base-neutral75);

        .backend & {
          color: var(--color-base-neutral20);
        }

        .dismiss {
          ${buttonUnstyled}
          margin-top: 10px;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }

    .stacks {
      margin-top: 5vh;
      font-family: var(--font-family-mono);

      .stack + .stack {
        margin-top: 50px;
      }

      h3 {
        margin-bottom: 15px;
        text-align: center;
      }

      .footnote {
        display: block;
        font-size: 12px;
        font-style: italic;
        color: var(--color-base-neutral40);
        text-align: center;
      }

      ol {
        background-color: var(--color-base-neutral05);
        padding-inline-start: 50px;

        li {
          padding: 5px;
        }

        li:nth-child(even) {
          background-color: ${darken("neutral05", 0.025)};
        }

        span.highlight {
          color: var(--error-color);
        }

        span.location {
          display: block;
          padding-top: 4px;
          font-size: 13px;
        }
      }
    }
  }
`;
