import { headingPrimary, marker } from "theme/styles/mixins";
import { textBody, textCode } from "./mixins";

export default `
  .info {
    hgroup.main {
      margin: 0 0 20px;

      a {
        font-size: 12px;
      }
    }

    pre {
      font-size: 14px;
    }

    p,
    li,
    table {
      font-size: 14px;
      ${textBody}
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      ${textBody}
    }

    > div {
      margin: 0 0 5px;
    }

    .base-url {
      margin: 0;
      font-size: 12px;
      font-weight: 300 !important;
      ${textCode()}
    }

    .title {
      ${headingPrimary}
      margin-bottom: 0.25em;

      small {
        ${marker}
        display: inline-block;
        padding: 5px;
        margin-left: 10px;
        border-radius: 5px;

        pre {
          padding: 0;
          margin: 0;
        }
      }
    }
  }
`;
