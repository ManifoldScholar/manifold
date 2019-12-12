const ingestion = () => ({
  type: "ingestions",
  attributes: {
    state: "sleeping",
    sourceFileName: "some-file.epub",
    externalSourceUrl: null,
    strategy: "Ingestions::Strategies::Epub",
    availableEvents: ["reset", "process"]
  }
});

export default ingestion;
