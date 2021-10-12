const containerGap = "50px";

export default `
  .groups-page-container {
    > * + * {
      margin-top: ${containerGap};
    }
  }
`;
