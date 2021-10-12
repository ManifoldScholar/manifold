import { respond } from "./common";
import { subtitlePrimary } from "./typography";
import {
  buttonUnstyled,
  blockLabelRound,
  inputLabelPrimary,
  inputPrimary
} from "./appearance";

// The really messy mixins that jumble a bunch of other ones together
// Should become components!

// // Project List Item styles, used in global .project-list class,
// // plus draggable Project Collection items, which aren't nested
export const projectListItem = `
  display: flex;
  padding: 15px 0;
  color: inherit;
  text-decoration: none;

  .cover {
    position: relative;
    min-width: 50px;
    max-width: 50px;
    height: auto;
    padding-top: 0;
    margin-bottom: 0;
    line-height: 1;

    + .meta {
      padding-left: 15px;
    }

    > img,
    > svg {
      width: 50px;
      height: auto;
    }

    > img {
      border: 1px solid transparent;
      transition: border var(--transition-duration-default)
        var(--transition-timing-function);
    }

    > svg {
      max-height: 50px;
      overflow: visible;
      transition: fill var(--transition-duration-default)
        var(--transition-timing-function);
    }
  }

  .meta {
    display: flex;
    flex-flow: column;
    flex-grow: 1;
    width: 100%;
    padding-right: 20px;
    vertical-align: top;
  }

  .name {
    margin: 0;
    font-size: 16px;
    font-weight: var(--font-weight-semibold);
    hyphens: none;
    line-height: 1.188;
    white-space: normal;
    transition: color var(--transition-duration-default)
      var(--transition-timing-function);

    .title-text {
      display: inline-block;
      font-family: var(--font-family-sans);
    }

    .subtitle {
      ${subtitlePrimary}
      display: block;
      padding-top: 0.143em;
      font-size: 14px;
      color: var(--color-base-neutral40);
      transition: color var(--transition-duration-default)
        var(--transition-timing-function);

      &:empty {
        display: none;
      }
    }
  }

  .block-label {
    ${blockLabelRound}
    padding-right: 5px;
    padding-left: 5px;
    margin: 2px 0 5px 9px;
    font-size: 9px;
    vertical-align: middle;
  }

  .relations-list {
    font-family: var(--font-family-serif);
    hyphens: none;
    line-height: 1.25;
    transition: color var(--transition-duration-default)
      var(--transition-timing-function);
  }

  .date {
    font-family: var(--font-family-serif);
    font-size: 14px;
    font-style: italic;

    ${respond(`font-size: 16px;`, 75)}
  }
`;

export const projectGridItem = `
  ${projectListItem}

  ${respond(
    `
      flex-direction: column;
      height: 100%;
      padding: 2.105vw;

      .cover {
        width: 100%;
        min-width: 100%;
        margin-bottom: 16px;

        + .meta {
          padding-left: 0;
        }

        > img,
        > svg {
          width: auto;
          height: 100%;
        }
      }

      .meta {
        padding-right: 0;
      }

      .name {
        .title-text {
          display: block;
        }

        .subtitle {
          padding-top: 0.389em;
        }
      }

      .block-label {
        padding-right: 8px;
        padding-left: 8px;
        margin: 10px 0 0;
        font-size: 12px;
      }
    `,
    75
  )}
`;

// Form Layout
// --------------------------------------------------------
// TODO: This combines appearance mixins and should be a shared class or mixin
export const loginFormPrimary = `
  .field + .field {
    margin-top: 27px;
  }

  .login-links {
    margin-top: 25px;

    button {
      ${buttonUnstyled}
      display: block;
      font-style: italic;
      text-decoration: underline;

      + button {
        margin-top: 14px;
        margin-left: 0;
      }
    }

    a {
      font-style: italic;

      + a {
        margin-top: 14px;
        margin-left: 0;
      }
    }
  }

  .login-external {
    margin-top: 45px;
  }

  .button-secondary--dark {
    display: flex;
    width: 100%;
  }

  label {
    ${inputLabelPrimary}
  }

  input[type="text"],
  input[type="password"],
  input[type="email"] {
    ${inputPrimary}
  }

  .button-secondary {
    display: flex;
    margin-top: 30px;
  }
`;
