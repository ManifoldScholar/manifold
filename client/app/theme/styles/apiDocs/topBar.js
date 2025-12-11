export default `
  .topbar {
    padding: 10px 0;
    background-color: var(--topbar-background-color);

    .topbar-wrapper {
      display: flex;
      align-items: center;
    }

    a {
      display: flex;
      flex: 1;
      align-items: center;
      max-width: 300px;
      font-size: 1.5em;
      font-weight: bold;
      text-decoration: none;
      font-family: var(--font-family-sans);

      span {
        padding: 0 10px;
        margin: 0;
      }
    }

    .download-url-wrapper {
      display: flex;
      flex: 3;
      justify-content: flex-end;

      input[type="text"] {
        width: 100%;
        margin: 0;
        border: 2px solid var(--topbar-download-url-wrapper-element-border-color);
        border-radius: 4px 0 0 4px;
        outline: none;
      }

      .select-label {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 600px;
        margin: 0;
        color: #f0f0f0;

        span {
          flex: 1;
          padding: 0 10px 0 0;
          font-size: 16px;
          text-align: right;
        }

        select {
          flex: 2;
          width: 100%;
          border: 2px solid var(--topbar-download-url-wrapper-element-border-color);
          outline: none;
          box-shadow: none;
        }
      }

      .download-url-button {
        padding: 4px 30px;
        font-size: 16px;
        font-weight: bold;
        background: var(--topbar-download-url-button-background-color);
        border: none;
        border-radius: 0 4px 4px 0;
        font-family: var(--font-family-sans);
      }
    }
  }
`;
