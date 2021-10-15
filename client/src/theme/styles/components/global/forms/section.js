import { utilityPrimary, respond } from "theme/styles/mixins";

export default `
  .form-section {
    & + & {
      margin-top: 45px;

      ${respond(`margin-top: 52px;`, 60)}
    }

    .form-subsection-label {
      padding-left: 24px;
      margin-top: 40px;

      h2,
      h3,
      span {
        ${utilityPrimary}
        width: 100%;
        font-size: 14px;
        font-weight: var(--font-weight-semibold);
        color: var(--color-base-neutral50);
        letter-spacing: 0.1em;
      }
    }

    .form-input-group {
      display: flex;
      flex-flow: column wrap;

      ${respond(
        `
        flex-direction: row;
        justify-content: space-between;
      `,
        90
      )}

      > .buttons-icon-horizontal {
        ${respond(`flex-basis: 100%;`, 90)}
      }

      &--primary {
        > .form-input {
          margin-bottom: 35px;

          ${respond(`margin-top: 18px;`, 90)}

          &:last-child {
            margin-bottom: 12px;
          }

          &.extra-space-bottom {
            margin-bottom: 32px;
          }
        }
      }

      &--secondary {
        > .form-input {
          margin-bottom: 25px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      > .form-input {
        flex: 0 1 auto;
        margin-top: 0;

        ${respond(`flex-basis: 47.64%;`, 90)}

        &.wide {
          ${respond(`flex-basis: 100%;`, 90)}
        }

        &.form-input-fourth {
          ${respond(`flex-basis: 23.82%;`, 90)}
        }

        &.form-input-third {
          ${respond(`flex-basis: 31.76%;`, 90)}
        }

        .form-select {
          width: 100%;
        }
      }

      > .form-divider.wide {
        ${respond(`flex-basis: 100%;`, 90)}
      }
    }

    &.horizontal {
      .form-input {
        display: block;
        margin-right: 0;

        ${respond(
          `
          display: inline-block;
          margin-right: 40px;
          margin-bottom: 20px;

          &:last-child {
            margin-right: 0;
          }
        `,
          60
        )}
      }

      .form-input-fourth {
        width: 18%;
      }

      .form-input-third {
        width: 30%;
      }

      .form-input + .form-input,
      .form-input + .form-section,
      .form-section + .form-section,
      .form-section + .form-input {
        ${respond(`margin-top: 0;`, 60)}
      }
    }
  }

  header {
    + .form-section {
      margin-top: 19px;
    }
  }
`;
