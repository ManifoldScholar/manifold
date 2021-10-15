import { css } from "styled-components";
import { respond, clearfix } from "theme/styles/mixins";

export default `
  .feature {
    position: relative;
    font-size: 17px;

    &.feature-preview {
      margin-bottom: 40px;
      font-size: 15px;
    }

    .container {
      ${clearfix()}
    }

    &.feature-dark-style {
      --hover-color: var(--color-neutral-text-extra-dark);
      --focus-color: var(--color-neutral-text-extra-dark);

      color: var(--color-neutral-text-extra-dark);
      background-color: var(--color-accent-primary);
    }

    &.feature-light-style {
      --hover-color: var(--color-interaction-dark);
      --focus-color: var(--color-interaction-dark);

      background-color: var(--color-accent-primary-off-white);

      .heading-primary, .heading-secondary {
        color: var(--color-interaction-dark);
      }
    }

    .left {
      top: 0;
      left: 0;
      float: right;
      width: 100%;
      padding-top: 4em;
      padding-right: 2em;
      padding-bottom: 4em;
      hyphens: none;

      ${respond(
        css`
          width: 50%;
        `,
        75
      )}

      ${respond(
        css`
          padding-right: 4em;
        `,
        95
      )}

      p {
        font-family: var(--font-family-copy);
        line-height: 1.353em;

        + p {
          margin-top: 1em;
        }
      }
    }

    .right {
      position: relative;
      top: 0;
      right: 0;
      display: none;
      float: right;
      width: 50%;
      padding-left: 1.475em;

      ${respond(
        css`
          display: block;
        `,
        75
      )}

      img {
        position: relative;
        top: 4em;
      }
    }

    &__buttons {
      margin-top: 1.5em;
    }

    .heading-primary {
      font-size: 22px;

      ${respond(
        css`
          font-size: 24px;
        `,
        60
      )}

      ${respond(
        css`
          font-size: 1.5em;
        `,
        90
      )}
    }

    .heading-secondary {
      font-size: 1.29em;
    }

    .heading-primary, .heading-secondary {
      margin-bottom: 0;
    }

    .heading-primary + .heading-secondary {
      margin-top: 0.3em;
    }

    .feature-body {
      margin-top: 1.5em;

      a {
        text-decoration: underline;
      }
    }
  }
`;
