export default `
  .servers {
    > label {
      margin: -20px 15px 0 0;
      font-size: 12px;
      font-family: var(--font-family-sans);

      select {
        min-width: 130px;
        max-width: 100%;
      }
    }

    h4.message {
      padding-bottom: 2em;
    }

    table {
      tr {
        width: 30em;
      }

      td {
        display: inline-block;
        max-width: 15em;
        padding-top: 10px;
        padding-bottom: 10px;
        vertical-align: middle;

        &:first-of-type {
          padding-right: 2em;
        }

        input {
          width: 100%;
          height: 100%;
        }
      }
    }

    .computed-url {
      margin: 2em 0;

      code {
        display: inline-block;
        padding: 4px;
        margin: 0 1em;
        font-size: 16px;
      }
    }
  }

  .servers-title {
    font-size: 12px;
    font-weight: bold;
  }

  .operation-servers {
    h4.message {
      margin-bottom: 2em;
    }
  }
`;
