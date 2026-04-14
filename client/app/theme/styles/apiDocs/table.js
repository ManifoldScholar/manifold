import { textCode, textBody } from "./mixins";

export default `
  table {
    width: 100%;
    padding: 0 10px;
    border-collapse: collapse;

    &.model {
      tbody {
        tr {
          td {
            padding: 0;
            vertical-align: top;

            &:first-of-type {
              min-width: 50px;
              padding: 0 0 0 2em;
            }
          }
        }
      }
    }

    &.headers {
      td {
        font-size: 12px;
        font-weight: 300;
        vertical-align: middle;
        ${textCode()}
      }
    }

    tbody {
      tr {
        td {
          padding: 10px 0 0;
          vertical-align: top;

          &:first-of-type {
            min-width: 6em;
            padding: 10px 0;
          }
        }
      }
    }

    thead {
      tr {
        th,
        td {
          padding: 12px 0;
          font-size: 12px;
          font-weight: bold;
          text-align: left;
          border-bottom: 1px solid var(--table-thead-td-border-bottom-color);
          ${textBody}
        }
      }
    }
  }

  .parameters-col_description {
    width: 99%;
    margin-bottom: 2em;

    input[type="text"] {
      width: 100%;
      max-width: 340px;
    }

    select {
      border-width: 1px;
    }
  }

  .parameter__name {
    margin-right: 0.75em;
    font-size: 16px;
    font-weight: normal;
    font-family: var(--font-family-sans);

    &.required {
      &::after {
        position: relative;
        top: -6px;
        padding: 5px;
        font-size: 10px;
        color: var(--table-parameter-name-required-font-color);
        content: "required";
      }
    }
  }

  .parameter__in,
  .parameter__extension {
    font-size: 12px;
    font-style: italic;
    ${textCode("var(--table-parameter-in-font-color)")}
  }

  .parameter__deprecated {
    font-size: 12px;
    font-style: italic;
    ${textCode("var(--table-parameter-deprecated-font-color)")}
  }

  .parameter__empty_value_toggle {
    padding-top: 5px;
    padding-bottom: 12px;
    font-size: 13px;

    input {
      margin-right: 7px;
    }

    &.disabled {
      opacity: 0.7;
    }
  }

  .table-container {
    padding: 20px;
  }

  .col_header {
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-medium);
  }

  .response-col_description {
    width: 99%;
  }

  .response-col_links {
    min-width: 6em;
  }
`;
