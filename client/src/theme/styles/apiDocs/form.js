import { invalidFormElement, textCode } from "./mixins";

export default `
  select {
    padding: 5px 40px 5px 10px;
    font-size: 14px;
    background: var(--form-select-background-color)
      url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+ICAgIDxwYXRoIGQ9Ik0xMy40MTggNy44NTljLjI3MS0uMjY4LjcwOS0uMjY4Ljk3OCAwIC4yNy4yNjguMjcyLjcwMSAwIC45NjlsLTMuOTA4IDMuODNjLS4yNy4yNjgtLjcwNy4yNjgtLjk3OSAwbC0zLjkwOC0zLjgzYy0uMjctLjI2Ny0uMjctLjcwMSAwLS45NjkuMjcxLS4yNjguNzA5LS4yNjguOTc4IDBMMTAgMTFsMy40MTgtMy4xNDF6Ii8+PC9zdmc+)
      right 10px center no-repeat;
    background-size: 20px;
    border-radius: 4px;
    appearance: none;
    font-family: var(--font-family-sans);
    letter-spacing: normal;

    &[multiple] {
      padding: 5px;
      margin: 5px 0;
      background: var(--form-select-background-color);
    }

    &.invalid {
      ${invalidFormElement}
    }
  }

  .opblock-body select {
    min-width: 230px;
    @media (max-width: 768px) {
      min-width: 180px;
    }
  }

  label {
    margin: 0 0 5px;
    font-size: 12px;
    font-weight: bold;
    font-family: var(--font-family-sans);
  }

  input[type="text"],
  input[type="password"],
  input[type="search"],
  input[type="email"],
  input[type="file"],
  textarea {
    min-width: 100px;
    padding: 8px 10px;
    margin: 5px 0;
    background: var(--form-input-background-color);
    border: 1px solid var(--form-input-border-color);
    border-radius: 4px;

    @media (max-width: 768px) {
      max-width: 175px;
    }

    &.invalid {
      ${invalidFormElement}
    }
  }

  input,
  textarea,
  select {
    &[disabled] {
      color: #888;
      cursor: not-allowed;
      background-color: #fafafa;
    }
  }

  select[disabled] {
    border-color: #888;
  }

  textarea[disabled] {
    color: #fff;
    background-color: #41444e;
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  textarea {
    width: 100%;
    min-height: 280px;
    padding: 10px;
    font-size: 12px;
    background: var(--form-textarea-background-color);
    border: none;
    border-radius: 4px;
    outline: none;
    ${textCode()}

    &:focus {
      border: 2px solid var(--form-textarea-focus-border-color);
    }

    &.curl {
      min-height: 100px;
      padding: 10px;
      margin: 0;
      font-size: 12px;
      resize: none;
      background: var(--color-base-neutral90);
      border-radius: 4px;
      ${textCode("var(--opblock-body-font-color)")}
    }
  }

  .checkbox {
    padding: 5px 0 10px;
    color: var(--form-checkbox-label-font-color);
    transition: opacity 0.5s;

    label {
      display: flex;
    }

    p {
      margin: 0 !important;
      font-style: italic;
      font-weight: normal !important;
      ${textCode()}
    }

    input[type="checkbox"] {
      display: none;

      & + label > .item {
        position: relative;
        top: 3px;
        display: inline-block;
        flex: none;
        width: 16px;
        height: 16px;
        padding: 5px;
        margin: 0 8px 0 0;
        cursor: pointer;
        background: var(--form-checkbox-background-color);
        border-radius: 1px;
        box-shadow: 0 0 0 2px var(--form-checkbox-box-shadow-color);

        &:active {
          transform: scale(0.9);
        }
      }

      &:checked + label > .item {
        background: var(--form-checkbox-background-color)
          url(data:image/svg+xml,%0A%3Csvg%20width%3D%2210px%22%20height%3D%228px%22%20viewBox%3D%223%207%2010%208%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3C%21--%20Generator%3A%20Sketch%2042%20%2836781%29%20-%20http%3A//www.bohemiancoding.com/sketch%20--%3E%0A%20%20%20%20%3Cdesc%3ECreated%20with%20Sketch.%3C/desc%3E%0A%20%20%20%20%3Cdefs%3E%3C/defs%3E%0A%20%20%20%20%3Cpolygon%20id%3D%22Rectangle-34%22%20stroke%3D%22none%22%20fill%3D%22%2341474E%22%20fill-rule%3D%22evenodd%22%20points%3D%226.33333333%2015%203%2011.6666667%204.33333333%2010.3333333%206.33333333%2012.3333333%2011.6666667%207%2013%208.33333333%22%3E%3C/polygon%3E%0A%3C/svg%3E)
          center center no-repeat;
      }
    }
  }
`;
