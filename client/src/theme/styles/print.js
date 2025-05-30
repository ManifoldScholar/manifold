export default `
  @media print {
    .library-header {
      display: none;
    }

    .screen-reader-text {
      display: none;
    }

    body.reader .text-section {
      font-size: 16px;
      line-height: 1.25em;
    }

    body.reader .reader-header {
      display: none;
    }

    body.reader .section-next-section,
    body.reader .section-pagination {
      display: none;
    }

    body.reader .app-footer {
      display: none;
    }
  }
`;
