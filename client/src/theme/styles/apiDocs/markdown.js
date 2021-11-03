import { textCode } from "./mixins";

export default `
  .markdown,
  .renderedMarkdown {
    p + p,
    p + pre,
    pre + pre,
    pre + p {
      margin: 1em auto;
    }

    ul {
      margin-top: 15px;
      margin-bottom: 15px;
    }

    pre {
      padding: 0;
      font-weight: normal;
      color: black;
      white-space: pre-wrap;
      background: none;
    }

    code {
      padding: 5px 7px;
      font-size: 14px;
      background: var(--info-code-background-color);
      border-radius: 4px;
      ${textCode("var(--info-code-font-color)")}
    }

    pre > code {
      display: block;
    }
  }
`;
