import uuid from "uuid";
import has from "lodash/has";

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

const abilities = {
  read: true,
  create: true,
  update: true,
  delete: true,
  readDeleted: true,
  readDrafts: true,
  manageResources: true,
  createResources: true,
  manageResourceCollections: true,
  createResourceCollections: true,
  managePermissions: true,
  createPermissions: true,
  manageTexts: true,
  createTexts: true,
  manageTwitterQueries: true,
  createTwitterQueries: true,
  manageSocials: true,
  manageEvents: true,
  updateMakers: true,
  readSecrets: true,
  readLog: true
};

const classAbilities = {
  annotation: { create: true, read: true },
  comment: { create: true, read: true },
  project: { create: true, read: true },
  projectCollection: { create: true, read: true, update: true },
  permission: { create: true, read: true },
  resource: { create: true, read: true },
  settings: { create: true, read: true, update: true },
  statistics: { create: true, read: true },
  subject: { create: true, read: true },
  text: { create: true, read: true, update: true },
  user: { create: true, read: true, update: true },
  version: { create: true, read: true }
};

const metadataValues = {
  doi: "https://doi.org/10.12345.6789"
};

const defaults = {
  settings: {
    type: "settings",
    attributes: {
      abilities,
      general: {
        installationName: "Manifold",
        contactUrl: "http://www.dailyrowan.com",
        copyright: "2015-2016 6 University of Minnesota Press"
      },
      theme: {
        typekitId: "typekitId",
        logoStyles: `{"left": -1}`
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
          enabled: true,
          name: "google"
        },
        twitter: {
          enabled: true,
          name: "twitter"
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
      },
      copyrightFormatted: "2015-2016 6 University of Minnesota Press"
    }
  },

  project: {
    type: "projects",
    attributes: {
      metadataProperties,
      slug: "",
      title: "Rowan Test",
      titleFormatted: "Rowan Test",
      titlePlaintext: "Rowan Test",
      description:
        "The look in your eyes, I recognize it. You used to have it for me. I guess it's better to be lucky than good. Mr. Crusher, ready a collision course with the Borg ship. My oath is between Captain Kargan and myself. Your only concern is with how you obey my orders. Or do you prefer the rank of prisoner to that of lieutenant? That might've been one of the shortest assignments in the history of Starfleet. I'll alert the crew.",
      descriptionFormatted:
        "The look in your eyes, I recognize it. You used to have it for me. I guess it's better to be lucky than good. Mr. Crusher, ready a collision course with the Borg ship. My oath is between Captain Kargan and myself. Your only concern is with how you obey my orders. Or do you prefer the rank of prisoner to that of lieutenant? That might've been one of the shortest assignments in the history of Starfleet. I'll alert the crew.",
      subtitle: "World's Greatest Dog",
      darkMode: false,
      heroStyles: {},
      coverStyles: {},
      avatarStyles: {},
      avatarMeta: {},
      avatarColor: "primary",
      hashtag: "cute_dog",
      hideActivity: false,
      downloadCallToAction: "Download the greatest dog",
      abilities,
      metadata: metadataValues,
      metadataFormatted: metadataValues,
      imageCreditsFormatted: "<p>Rowan, <em>The Dog</em></p>"
    },
    relationships: {
      resources: [],
      actionCallouts: [],
      makers: [
        {
          type: "maker",
          attributes: {
            firstName: "John",
            lastName: "Milton",
            fullName: "John Milton"
          }
        }
      ]
    }
  },

  resourceCollection: {
    type: "resourceCollections",
    attributes: {
      title: "Rowan",
      slug: "",
      collectionResourcesCount: 0,
      createdAt: "2017-04-24T23:25:50.161Z",
      resourceKinds: ["image", "video"],
      resourceTags: ["dog"],
      thumbnailStyles: {},
      abilities
    },
    relationships: {
      resources: []
    }
  },

  collectionResource: {
    type: "collectionResources",
    attributes: {
      position: 1,
      resourceCollectionId: 2
    },
    relationships: {
      resource: null,
      resourceCollection: null
    }
  },

  contentBlock: {
    type: "contentBlocks",
    attributes: {
      type: "Content::MarkdownBlock",
      position: 1,
      visible: true,
      configurable: true,
      orderable: true,
      abilities: {},
      renderable: true,
      incompleteRenderAttributes: [],
      body: "body",
      bodyFormatted: "bodyFormatted",
      style: "shaded"
    },
    relationships: {
      project: null
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
      tagList: ["dog", "puppy", "GOAT"],
      abilities,
      metadata: metadataValues,
      metadataFormatted: metadataValues
    },
    relationships: {
      collectionResources: []
    }
  },

  ingestion: {
    type: "ingestions",
    attributes: {
      state: "sleeping",
      sourceFileName: "some-file.epub",
      externalSourceUrl: null,
      strategy: "Ingestions::Strategies::Epub",
      availableEvents: ["reset", "process"]
    }
  },

  comment: {
    type: "comments",
    attributes: {
      body: "Plaid clash with polka dots, I hope you ain't mad.",
      createdAt: new Date(2018, 11, 24, 10, 33, 30, 0),
      abilities
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
      role: "admin",
      kind: "admin",
      avatarStyles: {},
      isCurrentUser: true,
      classAbilities,
      abilities
    }
  },

  event: {
    type: "events",
    attributes: {
      eventType: "text_added",
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
      eventType: "tweet",
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
      slug: "",
      title: "Ain't No Thang",
      titleFormatted: "Ain't No Thang",
      titlePlaintext: "Ain't No Thang",
      creatorNames: "Andre3000, Big Boi",
      createdAt: "2017-04-24T23:25:50.161Z",
      published: true,
      coverStyles: {},
      rights: "All Rights Reserved",
      publicationDate: "2001-12-04",
      toc: ["Chapter 1", "Chapter 2"],
      abilities,
      metadata: metadataValues,
      metadataFormatted: metadataValues
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
      text: null
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

  page: {
    type: "pages",
    attributes: {
      isExternalLink: true,
      externalLink: "http://www.dailyrowan.com",
      title: "Daily Rowan",
      purpose: "terms_and_conditions",
      slug: "daily-rowan",
      showInFooter: true,
      hidden: false
    }
  },

  feature: {
    type: "features",
    attributes: {
      createdAt: "2017-04-24T23:25:50.161Z",
      live: true,
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

  readingGroup: {
    type: "readingGroup",
    attributes: {
      privacy: "private",
      currentUserRole: "owner",
      annotationsCount: 5,
      highlightsCount: 5,
      membershipsCount: 10,
      abilities
    }
  },

  readingGroupMembership: {
    type: "member",
    attributes: {
      abilities
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
  },

  annotation: {
    type: "annotations",
    attributes: {
      createdAt: "2017-04-24T23:25:50.161Z",
      subject: "Gods, Earths, and 85ers",
      body:
        "Hands on your boxes, turn 'em up like seven notches." +
        " Your Magnavoxes amplify my super conscious.",
      startNode: "some-node",
      creatorAvatarStyles: {},
      endNode: "another-node",
      startChar: 4,
      endChar: 13,
      abilities
    },
    relationships: {
      creator: {
        attributes: {
          fullName: "Harry Henderson",
          firstName: "Harry",
          lastName: "Henderson"
        }
      },
      textSection: {
        attributes: {
          name: "Title Page",
          textTitle: "Hail Seitan",
          metadataProperties
        }
      }
    }
  },

  subject: {
    type: "subjects",
    attributes: {
      name: "Hip Hop"
    }
  },

  twitterQuery: {
    type: "twitterQueries",
    attributes: {
      query: "from:manifoldscholar",
      active: true,
      resultsType: "most_recent",
      eventsCount: 0
    }
  },

  permission: {
    type: "permissions",
    attributes: {
      roleNames: ["project_author"]
    },
    relationships: {
      resource: null,
      user: null
    }
  },

  projectCollection: {
    type: "projectCollections",
    attributes: {
      title: "A Project Collection",
      sortOrder: "manual",
      manuallySorted: true,
      smart: false,
      featuredOnly: false,
      numberOfProjects: null,
      tagList: [],
      icon: "lamp",
      abilities
    },
    relationships: {
      collectionProjects: [],
      subjects: [],
      projects: []
    }
  },

  version: {
    type: "versions",
    attributes: {
      itemId: "1",
      itemType: "Resource",
      itemDisplayName: "The World Is Yours",
      actorName: "Nas",
      actorId: "1",
      createdAt: "2017-04-24T23:25:50.161Z",
      objectChanges: {
        title: ["original", "changed"]
      }
    }
  },

  actionCallout: {
    type: "actionCallouts",
    attributes: {
      title: "Start Reading",
      kind: "link",
      location: "left",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: true
    },
    relationships: {
      project: null
    }
  }
};

const buildEntity = (entityType, id = null, attributes, relationships) => {
  const entity = defaults[entityType];
  const out = {
    type: entity.type,
    id: id || uuid.v1(),
    attributes: { ...entity.attributes, ...attributes },
    relationships: { ...entity.relationships, ...relationships }
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

const resourceCollection = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("resourceCollection", id, attributes, relationships);
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

const subject = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("subject", id, attributes, relationships);
};

const twitterQuery = (
  id = null,
  attributes = {},
  relationships = { project: project() }
) => {
  return buildEntity("twitterQuery", id, attributes, relationships);
};

const permission = (
  id = null,
  attributes = {},
  relationships = { resource: project(), user: user() }
) => {
  return buildEntity("permission", id, attributes, relationships);
};

const version = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("version", id, attributes, relationships);
};

const page = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("page", id, attributes, relationships);
};

const readingGroup = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("readingGroup", id, attributes, relationships);
};

const readingGroupMembership = (
  id = null,
  attributes = {},
  relationships = {}
) => {
  return buildEntity("readingGroupMembership", id, attributes, relationships);
};

const projectCollection = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("projectCollection", id, attributes, relationships);
};

const actionCallout = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("actionCallout", id, attributes, relationships);
};

const contentBlock = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("contentBlock", id, attributes, relationships);
};

export default {
  defaults,
  project,
  resource,
  ingestion,
  resourceCollection,
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
  feature,
  subject,
  twitterQuery,
  permission,
  projectCollection,
  version,
  page,
  readingGroup,
  readingGroupMembership,
  actionCallout,
  contentBlock
};
