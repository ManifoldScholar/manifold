const metadataProperties = [
  "abstract",
  "archive",
  "archiveLocation",
  "archivePlace",
  "authority",
  "callNumber",
  "collectionTitle",
  "containerTitle",
  "dimensions",
  "event",
  "eventPlace",
  "isbn",
  "issn",
  "jurisdiction",
  "medium",
  "originalPublisher",
  "originalPublisherPlace",
  "originalTitle",
  "pmcid",
  "pmid",
  "publisher",
  "publisherPlace",
  "reviewedTitle",
  "section",
  "version",
  "yearSuffix",
  "chapterNumber",
  "collectionNumber",
  "edition",
  "issue",
  "number",
  "numberOfPages",
  "numberOfVolumes",
  "volume"
];

const metadataValues = {
  doi: "https://doi.org/10.12345.6789"
};

const metadata = () => {
  const out = {};
  metadataProperties.forEach(prop => {
    out[prop] = metadataValues[prop] || "some-value";
  });
  return out;
};

export default metadata;
