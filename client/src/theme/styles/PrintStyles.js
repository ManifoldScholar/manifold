import { createGlobalStyle } from "styled-components";

const PrintStyles = createGlobalStyle`
  @media print {
    .library-header {
      display: none;
    }

    .screen-reader-text {
      display: none;
    }

    body.reader {
      .text-section {
        font-size: 16px;
        line-height: 1.25em;
      }

      .reader-header {
        display: none;
      }

      .section-next-section, .section-pagination {
        display: none;
      }

      .app-footer-powered-by__logo {
        display: none;
      }
    }
  }
`;

export default PrintStyles;
