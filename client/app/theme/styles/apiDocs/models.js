import { textCode } from "./mixins";

export default `
  .model {
    font-size: 12px;
    font-weight: 300;
    ${textCode()}

    .markdown {
      ${textCode()}
      font-size: 12px;
    }

    .deprecated {
      span,
      td {
        color: var(--model-deprecated-font-color) !important;
      }

      > td:first-of-type {
        text-decoration: line-through;
      }
    }

    &-toggle {
      position: relative;
      top: 6px;
      display: inline-block;
      margin: auto 0.3em;
      font-size: 10px;
      cursor: pointer;
      transition: transform 0.15s ease-in;
      transform: rotate(90deg);
      transform-origin: 50% 50%;

      &.collapsed {
        transform: rotate(0deg);
      }

      &::after {
        display: block;
        width: 20px;
        height: 20px;
        content: "";
        background: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M10%206L8.59%207.41%2013.17%2012l-4.58%204.59L10%2018l6-6z%22/%3E%0A%3C/svg%3E%0A)
          center center no-repeat;
        background-size: 100%;
      }
    }

    &-jump-to-path {
      position: relative;
      cursor: pointer;

      .view-line-link {
        position: absolute;
        top: -0.4em;
        cursor: pointer;
      }
    }

    &-title {
      position: relative;

      &:hover .model-hint {
        visibility: visible;
      }
    }

    &-hint {
      position: absolute;
      top: -1.8em;
      padding: 0.1em 0.5em;
      color: var(--model-hint-font-color);
      white-space: nowrap;
      visibility: hidden;
      background: var(--model-hint-background-color);
      border-radius: 4px;
    }

    p {
      margin: 0 0 1em;
    }
  }

  section.models {
    margin: 30px 0;
    border: 1px solid var(--section-models-border-color);
    border-radius: 4px;

    &.is-open {
      padding: 0 0 20px;

      h4 {
        margin: 0 0 5px;
        border-bottom: 1px solid
          var(--section-models-isopen-h4-border-bottom-color);
      }
    }

    h4 {
      display: flex;
      align-items: center;
      padding: 10px 20px 10px 10px;
      margin: 0;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-family-sans);

      svg {
        transition: all 0.4s;
      }

      span {
        flex: 1;
      }

      &:hover {
        background: var(--section-models-h4-background-color-hover);
      }
    }

    h5 {
      margin: 0 0 10px;
      font-size: 16px;
      font-family: var(--font-family-sans);
    }

    .model-jump-to-path {
      position: relative;
      top: 5px;
    }

    .model-container {
      position: relative;
      margin: 0 20px 15px;
      background: var(--section-models-model-container-background-color);
      border-radius: 4px;
      transition: all 0.5s;

      &:hover {
        background: var(
          --section-models-model-container-background-color-hover
        );
      }

      &:first-of-type {
        margin: 20px;
      }

      &:last-of-type {
        margin: 0 20px;
      }

      .models-jump-to-path {
        position: absolute;
        top: 8px;
        right: 5px;
        opacity: 0.65;
      }
    }

    .model-box {
      background: none;
    }
  }

  .model-box {
    display: inline-block;
    padding: 10px;
    background: var(--section-models-model-box-background-color);
    border-radius: 4px;

    .model-jump-to-path {
      position: relative;
      top: 4px;
    }

    &.deprecated {
      opacity: 0.5;
    }
  }

  .model-title {
    font-size: 16px;
    font-family: var(--font-family-sans);
  }

  .model-deprecated-warning {
    margin-right: 1em;
    font-size: 16px;
    font-weight: 600;
    font-family: var(--font-family-sans);
  }

  span {
    > span.model {
      .brace-close {
        padding: 0 0 0 10px;
      }
    }
  }

  .prop-name {
    display: inline-block;

    margin-right: 1em;
  }

  .prop-type {
    color: var(--prop-type-font-color);
  }

  .prop-enum {
    display: block;
  }

  .prop-format {
    color: var(--prop-format-font-color);
  }
`;
