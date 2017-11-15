import uuid from "uuid";
import has from "lodash/has";

// Must be constant for comment snapshot 'days ago' rendering
const commentDate = new Date();
commentDate.setDate(commentDate.getDate() - 4);

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

const defaults = {
  settings: {
    type: "settings",
    attributes: {
      general: {
        contactUrl: "http://www.dailyrowan.com",
        copyright: "2015-2016 6 University of Minnesota Press"
      },
      theme: {
        typekitId: "typekitId"
      },
      integrations: {
        gaProfileId: null,
        gaTrackingId: null,
        twitterAppId: null,
        facebookAppId: null,
        googleClientId: null,
        googleProjectId: null,
        googleClientEmail: null,
        twitterAccessToken: null,
        googlePrivateKeyId: null,
        googleOauthClientId: null
      },
      secrets: {
        googlePrivateKey: null,
        twitterAppSecret: null,
        facebookAppSecret: null,
        googleOauthClientSecret: null,
        twitterAccessTokenSecret: null
      },
      oauth: {
        facebook: {
          enabled: false
        },
        googleOauth2: {
          enabled: true
        },
        twitter: {
          enabled: true
        }
      },
      pressLogoStyles: {
        small: null,
        smallSquare: null,
        smallLandscape: null,
        smallPortrait: null,
        medium: null,
        mediumSquare: null,
        mediumLandscape: null,
        mediumPortrait: null,
        largeLandscape: null,
        original: null
      }
    }
  },

  project: {
    type: "projects",
    attributes: {
      metadataProperties,
      slug: "",
      title: "Rowan Test",
      subtitle: "World's Greatest Dog",
      heroStyles: {},
      coverStyles: {},
      avatarStyles: {},
      hashtag: "#cute_dog",
      hideActivity: false
    },
    relationships: {
      resources: []
    }
  },

  collection: {
    type: "collections",
    attributes: {
      title: "Rowan",
      slug: "",
      createdAt: "2017-04-24T23:25:50.161Z",
      resourceKinds: ["image", "video"],
      resourceTags: ["dog"],
      thumbnailStyles: {}
    },
    relationships: {
      resources: []
    }
  },

  collectionResource: {
    type: "collectionResources",
    attributes: {
      position: 1,
      collectionId: 2
    },
    relationships: {
      resource: null,
      collection: null
    }
  },

  resource: {
    type: "resources",
    attributes: {
      title: "Image",
      slug: "",
      projectSlug: "delegated-project-slug",
      titleFormatted: "Image",
      kind: "image",
      attachmentStyles: {
        original: "original-image.mock",
        medium: null,
        mediumSquare: "original-image.mock"
      },
      descriptionFormatted: "Black and white freckles",
      createdAt: "2017-04-24T23:25:50.161Z",
      captionFormatted: "World's Greatest Dog",
      downloadable: true,
      tagList: ["dog", "puppy", "GOAT"]
    },
    relationships: {
      collectionResources: []
    }
  },

  ingestion: {
    type: "ingestions",
    attributes: {
      state: "analyzed",
      sourceFileName: "some-file.epub",
      externalSourceUrl: null,
      strategy: "Ingestor::Strategy::EPUB::Strategy",
      availableEvents: ["reset", "process"]
    }
  },

  comment: {
    type: "comments",
    attributes: {
      body: "Plaid clash with polka dots, I hope you ain't mad.",
      createdAt: commentDate
    },
    relationships: {
      creator: null
    }
  },

  user: {
    type: "users",
    attributes: {
      email: "test@cic-fake.gotcha",
      firstName: "Rowan",
      lastName: "Ida",
      fullName: "Rowan Ida",
      role: "Admin",
      avatarStyles: {},
      isCurrentUser: true
    }
  },

  event: {
    type: "events",
    attributes: {
      eventType: "TEXT_ADDED",
      eventTitle: "Text Added",
      eventSubtitle: "It was added",
      subjectType: "Text",
      subjectTitle: "New Text",
      createdAt: "2017-04-24T23:25:50.161Z",
      subjectSlug: "subject-slug",
      projectSlug: "project-slug"
    }
  },

  tweetEvent: {
    type: "events",
    attributes: {
      eventType: "TWEET",
      eventTitle: "Tweet Created",
      subjectType: "Tweet",
      subjectTitle: "New Tweet",
      createdAt: "2017-04-24T23:25:50.161Z",
      attributionName: "Manifold Scholarship",
      attributionUrl: "https://twitter.com/ManifoldScholar",
      attributionIdentifier: "ManifoldScholar",
      excerpt: "Manifold is great!"
    }
  },

  text: {
    type: "texts",
    attributes: {
      metadataProperties,
      title: "Ain't No Thang",
      creatorNames: "Andre3000, Big Boi",
      createdAt: "2017-04-24T23:25:50.161Z",
      published: true,
      coverStyles: {},
      rights: "All Rights Reserved",
      publicationDate: "2001-12-04",
      toc: ["Chapter 1", "Chapter 2"]
    },
    relationships: {
      project: null,
      category: null,
      stylesheets: []
    }
  },

  stylesheet: {
    type: "stylesheets",
    attributes: {
      position: 1,
      name: "Slarmbo",
      rawStyles: ".some-class { font-weight: bold }",
      styles: ".manifold-text-section .some-class { font-weight: bold }"
    },
    relationships: {
      texet: null
    }
  },

  category: {
    type: "categories",
    attributes: {
      title: "Hip Hop Classics",
      position: 1
    },
    relationships: {}
  },

  feature: {
    type: "features",
    attributes: {
      header: "Rowan, Top Dog",
      headerFormatted: "Rowan, Top Dog",
      subheader: "Blah blah blah",
      subheaderFormatted: "Blah blah blah",
      linkText: "Click it, dog",
      linkUrl: "http://dogs.com",
      body:
        "Hands on your boxes, turn 'em up like seven notches." +
        " Your Magnavoxes amplify my super conscious."
    }
  },

  annotation: {
    type: "annotations",
    attributes: {
      subject: "Gods, Earths, and 85ers",
      body:
        "Hands on your boxes, turn 'em up like seven notches." +
        " Your Magnavoxes amplify my super conscious.",
      startNode: "some-node",
      endNode: "another-node",
      startChar: 4,
      endChar: 13
    }
  },

  textSection: {
    type: "textSections",
    kind: "section",
    sourceIdentifier: "ro-dintl-001",
    attributes: {
      name: "Title Page",
      metadataProperties,
      bodyJson: {
        tag: "section",
        nodeType: "element",
        attributes: {
          id: "RO",
          type: "titlepage",
          class: "chapter"
        },
        children: {
          0: {
            tag: "h1",
            nodeType: "element",
            attributes: {},
            children: {
              0: {
                content: "A day in the life of Rowan",
                nodeType: "text",
                nodeUuid: "1234-5678-9000",
                textDigest: "1234-5678-9000"
              }
            }
          }
        }
      }
    }
  }
};

const buildEntity = (entityType, id = null, attributes, relationships) => {
  const entity = defaults[entityType];
  const out = {
    type: entity.type,
    id: id || uuid.v1(),
    attributes: Object.assign({}, entity.attributes, attributes),
    relationships: Object.assign({}, entity.relationships, relationships)
  };
  if (has(out.attributes, "slug")) out.attributes.slug = `slug-${out.id}`;
  return out;
};

const project = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("project", id, attributes, relationships);
};

const resource = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("resource", id, attributes, relationships);
};

const ingestion = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("ingestion", id, attributes, relationships);
};

const collection = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("collection", id, attributes, relationships);
};

const collectionResource = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("collectionResource", id, attributes, relationships);
};

const comment = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("comment", id, attributes, relationships);
};

const user = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("user", id, attributes, relationships);
};

const settings = (id = 0, attributes = {}, relationships = {}) => {
  return buildEntity("settings", id, attributes, relationships);
};

const event = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("event", id, attributes, relationships);
};

const tweetEvent = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("tweetEvent", id, attributes, relationships);
};

const text = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("text", id, attributes, relationships);
};

const stylesheet = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("stylesheet", id, attributes, relationships);
};

const category = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("category", id, attributes, relationships);
};

const annotation = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("annotation", id, attributes, relationships);
};

const textSection = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("textSection", id, attributes, relationships);
};

const feature = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("feature", id, attributes, relationships);
};

export default {
  defaults,
  project,
  resource,
  ingestion,
  collection,
  collectionResource,
  comment,
  user,
  settings,
  event,
  tweetEvent,
  text,
  category,
  annotation,
  stylesheet,
  textSection,
  feature
};
