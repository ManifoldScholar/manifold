import { textCode } from "./mixins";

export default `
  .auth-btn-wrapper {
    display: flex;
    justify-content: center;
    padding: 10px 0;

    .btn-done {
      margin-right: 1em;
    }
  }

  .auth-wrapper {
    display: flex;
    flex: 1;
    justify-content: flex-end;

    .authorize {
      padding-right: 20px;
      margin-right: 10px;
    }
  }

  .auth-container {
    padding: 10px 20px;
    margin: 0 0 10px;
    border-bottom: 1px solid var(--auth-container-border-color);

    &:last-of-type {
      padding: 10px 20px;
      margin: 0;

      border: 0;
    }

    h4 {
      margin: 5px 0 15px !important;
    }

    .wrapper {
      padding: 0;
      margin: 0;
    }

    input[type="text"],
    input[type="password"] {
      min-width: 230px;
    }

    .errors {
      padding: 10px;
      font-size: 12px;
      border-radius: 4px;
      ${textCode()}
    }
  }

  .scopes {
    h2 {
      font-size: 14px;
      font-family: var(--font-family-sans);
    }
  }

  .scope-def {
    padding: 0 0 20px;
  }
`;
