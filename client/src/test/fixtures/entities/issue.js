import abilities from "../structures/abilities";
import metadata from "../structures/metadata";

const issue = () => ({
  data: {
    id: "b776c9d2-0962-475c-8894-e68c153f8968",
    type: "journalIssues",
    attributes: {
      title: "Vol. 23, No. 9",
      titleFormatted: "Vol. 23, No. 9",
      titlePlaintext: "Vol. 23, No. 9",
      subtitle: "Issue subtitle",
      subtitleFormatted: "Aug 1984",
      subtitlePlaintext: "Aug 1984",
      description:
        "Donec ullamcorper nulla non metus auctor fringilla. Cras mattis consectetur purus sit amet fermentum.",
      descriptionFormatted:
        "Donec ullamcorper nulla non metus auctor fringilla. Cras mattis consectetur purus sit amet fermentum.",
      publicationDate: "1984-08-01",
      createdAt: "2020-12-28T17:53:08.172Z",
      updatedAt: "2021-01-29T21:36:06.567Z",
      slug: "vol-23-no-9",
      avatarColor: "primary",
      avatarMeta: {},
      draft: false,
      finished: true,
      creatorNames: "Neda Atanasoski, Christine Hong",
      recentlyUpdated: false,
      updated: true,
      avatarStyles: {},
      abilities: abilities(),
      metadataProperties: Object.keys(metadata()),
      metadata: metadata(),
      metadataFormatted: metadata(),
      heroStyles: {},
      coverStyles: {}
    },
    relationships: {
      articles: [
        {
          id: "997578db-e1d2-4b9d-9d11-9d7a08b11498",
          type: "articles"
        },
        {
          id: "14e904c5-ee6d-499c-8eca-474221030455",
          type: "articles"
        },
        {
          id: "36f42f4f-08d4-40c6-8140-39ec6fe9c1aa",
          type: "articles"
        }
      ],
      parent: {}
    },
    meta: {
      partial: false
    }
  }
});

export default issue;
