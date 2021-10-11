import {
  listUnstyled,
  utilityPrimary,
  fluidScale,
  respond
} from "theme/styles/mixins";

export default `
  .meta-list-secondary {
    ${listUnstyled}

    &.columnar {
      ${respond(
        `
          max-width: 810px;
          column-count: 2;
        `,
        60
      )}
    }

    li {
      ${utilityPrimary}
      display: block;
      width: 100%;
      font-size: 13px;

      + li {
        margin-top: 10px;
      }

      .meta-label {
        &::after {
          display: inline;
          content: ': ';
        }
      }

      .meta-value {
        margin-top: 3px;
        color: var(--strong-color);

        a {
          text-decoration: underline;
        }
      }
    }
  }

  .meta-list-primary {
    ${listUnstyled}

    &.columnar {
      ${respond(
        `
          column-gap: 10.2vw;
          columns: 2;
        `,
        60
      )}
      ${respond(`column-gap: 30px;`, 75)}
      ${respond(`columns: 3;`, 85)}
    }

    + .meta-list-primary {
      ${respond(`margin-top: 30px;`, 60)}
    }

    li {
      display: inline-block;
      width: 100%;
      break-inside: avoid;
    }

    .meta-label {
      ${utilityPrimary}
      display: block;
      font-size: 12px;

      ${respond(`font-size: 14px;`, 60)}
    }

    .meta-value {
      margin-top: 7px;
      margin-bottom: 1.667em;
      font-size: ${fluidScale("20px", "18px")};
      font-family: var(--font-family-sans);
      color: var(--strong-color);

      ${respond(`margin-top: 10px;`, 60)}
    }
  }
`;
