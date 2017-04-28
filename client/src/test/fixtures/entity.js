import uuid from 'uuid';

const defaults = {

  settings: {
    type: "settings",
    attributes: {
      general: {},
      theme: {
        typekitId: null
      }
    },
    features: {},
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
    }
  },

  project: {
    type: "projects",
    attributes: {
      title: "Rowan Test"
    },
    relationships: {
      resources: []
    }
  },

  collection: {
    type: "collections",
    attributes: {
      title: "Rowan",
      createdAt: "2017-04-24T23:25:50.161Z",
      resourceKinds: ["image", "video"],
      resourceTags: ["dog"]
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
      kind: "image",
      attachmentStyles: {
        medium: null
      },
      captionFormatted: "World's Greatest Dog"
    },
    relationships: {
      collectionResources: []
    }
  }

};

const buildEntity = (entityType, id = null, attributes, relationships) => {
  const entity = defaults[entityType];
  return {
    type: entity.type,
    id: id || uuid.v1(),
    attributes: Object.assign({}, entity.attributes, attributes),
    relationships: Object.assign({}, entity.relationships, relationships)
  };
};

const project = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("project", id, attributes, relationships);
};

const resource = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("resource", id, attributes, relationships);
};

const collection = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("collection", id, attributes, relationships);
};

const collectionResource = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("collectionResource", id, attributes, relationships);
};

const settings = (id = 0, attributes = {}, relationships = {}) => {
  return buildEntity("settings", id, attributes, relationships);
};

export default {
  project,
  resource,
  collection,
  collectionResource,
  settings
};
