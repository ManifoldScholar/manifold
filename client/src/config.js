require("babel-polyfill");

const environmentConfiguration = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || "development"];

const clientUrl = () => {
  return `${process.env.USE_SSL ? "https" : "http"}://${process.env.DOMAIN}`;
};

const apiUrl = () => {
  if (process.env.API_URL) return process.env.API_URL;
  if (__SERVER__)
    return `${process.env.USE_SSL ? "https" : "http"}://${process.env.DOMAIN}`;
  return "";
};

const cableUrl = () => {
  if (process.env.CABLE_URL) return process.env.CABLE_URL;
  if (process.env.USE_SSL) return `wss://${process.env.DOMAIN}/cable`;
  return "/cable";
};

// eslint-disable max-len
const applicationConfiguration = {
  // Used by server-side node applications
  clientPort: process.env.CLIENT_SERVER_PORT || 3010,
  clientFallbackPort: process.env.CLIENT_SERVER_FALLBACK_PORT || 3011,
  clientSocket: process.env.CLIENT_SERVER_SOCKET,
  assetPort: process.env.CLIENT_ASSET_PORT || 3012,
  // Used by both server-side and client-side code
  apiUrl: apiUrl(),
  cableUrl: cableUrl(),
  clientUrl: clientUrl(),
  domain: process.env.DOMAIN,
  app: {
    head: {
      defaultTitle: "Manifold Scholarship",
      meta: [
        { charset: "utf-8" },
        {
          name: "description",
          content:
            "Transforming scholarly publications into living digital works"
        },
        { property: "og:site_name", content: "Manifold Scholarship" },
        {
          property: "og:image",
          content: `${clientUrl()}/static/logo.jpg`
        },
        { property: "og:locale", content: "en_US" },
        { property: "og:title", content: "Manifold Scholarship" },
        {
          property: "og:description",
          content:
            "Transforming scholarly publications into living digital works"
        },
        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:site", content: "@manifoldscholar" }
      ]
    },
    locale: {
      event_types: {
        PROJECT_CREATED: "Project Created",
        TEXT_ADDED: "Text Added",
        TEXT_ANNOTATED: "Text Annotated",
        RESOURCE_ADDED: "Resource Added",
        TWEET: "Tweet"
      },
      dialogs: {
        notation: {
          destroy: {
            heading: "Are you sure you want to remove this notation?",
            message:
              "Pressing yes will remove the notation from this spot in the text. " +
              "It will not remove it from the project."
          }
        }
      },
      metadata: {
        abstract: {
          type: "TextInput",
          placeholder: "Abstract of the item",
          instructions: "e.g. the abstract of a journal article"
        },
        archive: {
          placeholder: "Archive storing the item",
          type: "TextInput"
        },
        archiveLocation: {
          placeholder: "Storage location within an archive",
          instructions: "e.g. a box and folder number",
          type: "TextInput"
        },
        archivePlace: {
          placeholder: "Geographic location of the archive",
          type: "TextInput"
        },
        authority: {
          placeholder: "Issuing or judicial authority",
          type: "TextInput"
        },
        callNumber: {
          placeholder: "Call number (to help locate the item in a library)",
          type: "TextInput"
        },
        collectionTitle: {
          placeholder: "Title of the collection holding the item",
          instructions: "(e.g. the series title for a book)",
          type: "TextInput"
        },
        containerTitle: {
          placeholder: "Title of the container holding the item",
          instructions:
            "e.g. the book title for a book chapter, the journal title for a journal article",
          type: "TextInput"
        },
        dimensions: {
          placeholder: "physical or temporal dimensions of the item",
          instructions: "e.g. the physical size or running time",
          type: "TextInput"
        },
        event: {
          placeholder: "name of the related event",
          instructions: "the conference name when citing a conference paper",
          type: "TextInput"
        },
        eventPlace: {
          placeholder: "geographic location of the related event",
          instructions: 'e.g. "Amsterdam, the Netherlands"',
          type: "TextInput"
        },
        isbn: {
          placeholder: "International Standard Book Number",
          type: "TextInput"
        },
        issn: {
          placeholder: "International Standard Serial Number",
          type: "TextInput"
        },
        jurisdiction: {
          placeholder: "Geographic scope of relevance ",
          instructions: 'e.g. "US" for a US patent',
          type: "TextInput"
        },
        medium: {
          placeholder: "Medium description",
          instructions: 'e.g. "CD", "DVD", etc.',
          type: "TextInput"
        },
        originalPublisher: {
          placeholder:
            "Original publisher, for items that have been republished by a different publisher",
          type: "TextInput"
        },
        originalPublisherPlace: {
          placeholder: "Geographic location of the original publisher",
          type: "TextInput"
        },
        originalTitle: {
          placeholder: "Title of the original version",
          type: "TextInput"
        },
        pmcid: {
          placeholder: "PubMed Central reference number",
          type: "TextInput"
        },
        pmid: {
          placeholder: "PubMed reference number",
          type: "TextInput"
        },
        publisher: {
          placeholder: "The Publisher",
          type: "TextInput"
        },
        publisherPlace: {
          placeholder: "Geographic location of the publisher",
          type: "TextInput"
        },
        reviewedTitle: {
          placeholder: "Title of the item reviewed by the current item",
          type: "TextInput"
        },
        section: {
          placeholder: "Container section holding the item",
          instructions: 'e.g. "politics" for a newspaper article',
          type: "TextInput"
        },
        status: {
          placeholder: "Publication status of the item",
          instructions: 'e.g "forthcoming"',
          type: "TextInput"
        },
        version: {
          placeholder: "Version of the item",
          type: "TextInput"
        },
        yearSuffix: {
          placeholder: "Disambiguating year suffix in author-date styles",
          instructions: 'e.g. “a” in "Doe, 1999a"',
          type: "TextInput"
        },
        chapterNumber: {
          type: "TextInput"
        },
        collectionNumber: {
          placeholder: "Number identifying the collection holding the item",
          instructions: "e.g. the series number for a book",
          type: "TextInput"
        },
        edition: {
          placeholder: "(Container) edition holding the item",
          instructions:
            'e.g. "3" when citing a chapter in the third edition of a book',
          type: "TextInput"
        },
        issue: {
          placeholder: "(Container) issue holding the item",
          instructions:
            'e.g. "5" when citing a journal article from journal volume 2, issue 5',
          type: "TextInput"
        },
        number: {
          placeholder: "Number identifying the item",
          instructions: "e.g. a report number",
          type: "TextInput"
        },
        numberOfPage: {
          placeholder: "Total number of pages of the cited item",
          type: "TextInput"
        },
        numberOfVolumes: {
          placeholder:
            "Total number of volumes, usable for citing multi-volume books and such",
          type: "TextInput"
        },
        volume: {
          placeholder: "(Container) volume holding the item ",
          instructions: "e.g. “2” when citing a chapter from book volume 2",
          type: "TextInput"
        }
      }
    }
  }
};
// eslint-enable max-len

module.exports = Object.assign(
  {},
  environmentConfiguration,
  applicationConfiguration
);
