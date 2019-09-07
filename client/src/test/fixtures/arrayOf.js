import entities from "./entity";
import pluralize from "pluralize";
import faker from "faker";
import times from "lodash/times";
import sample from "lodash/sample";
import sampleSize from "lodash/sampleSize";
import isPlainObject from "lodash/isPlainObject";
import random from "lodash/random";
import uuid from "uuid";

const defaultCount = 5;

export function image() {
  const square = faker.image.image(200, 200);
  const landscape = faker.image.image(320, 200);
  const portrait = faker.image.image(200, 300);
  const original = random(0, 100) > 50 ? portrait : landscape;

  return {
    original,
    small: original,
    smallSquare: square,
    smallLandscape: landscape,
    smallPortrait: portrait,
    medium: original,
    mediumSquare: square,
    mediumLandscape: landscape,
    mediumPortrait: portrait,
    largeLandscape: landscape
  };
}

function imageMeta() {
  return {
    original: "yes"
  };
}

function mergeAttributes(entity, attr) {
  /* eslint-disable no-param-reassign */
  entity.attributes = Object.assign({}, entity.attributes, attr);
  /* eslint-enable no-param-reassign */
  return entity;
}

function arrayOf(type, count = defaultCount, attrBuilder = null) {
  const out = [];
  const key = pluralize.singular(type);
  const entity = entities[key];
  times(count, () => {
    out.push(entity(uuid()));
  });
  if (attrBuilder) {
    const adjusted = out.map(e => {
      const attr = attrBuilder(e);
      return isPlainObject(attr) ? mergeAttributes(e, attr) : e;
    });
    return adjusted;
  }

  return out;
}

function users(count = defaultCount) {
  return arrayOf("users", count, () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const fullName = `${firstName} ${lastName}`;
    const role = sample(["admin", "reader", "marketeer"]);
    const out = { firstName, lastName, fullName, role };
    if (random(0, 100) > 50) {
      out.avatarStyles = image();
    }
    return out;
  });
}

function readingGroups(count = defaultCount) {
  return arrayOf("readingGroups", count, () => {
    const name = faker.company.catchPhrase();
    const type = "private";
    const role = "member";
    const number = 15;
    return {
      name,
      type,
      role,
      memberCount: number,
      annotationCount: number,
      highlightCount: number
    };
  });
}

function readingGroupMemberships(count = defaultCount) {
  const readingGroup = readingGroups(1)[0];
  return arrayOf("readingGroupMemberships", count, rgm => {
    /* eslint-disable no-param-reassign */
    rgm.relationships.user = users(1)[0];
    rgm.relationships.readingGroup = readingGroup;
    rgm.attributes.annotationsCount = random(0, 10);
    rgm.attributes.highlightsCount = random(0, 10);
  });
}

function contentBlocks(count = defaultCount) {
  let id = 0;
  return arrayOf("contentBlocks", count, e => {
    id += 1;
    e.id = id;
    return {
      position: id
    };
  });
}

function projects(count = defaultCount) {
  return arrayOf("projects", count, () => {
    const title = faker.company.catchPhrase();
    const subtitle = faker.company.catchPhrase();
    const name = faker.company.catchPhrase();
    const attr = {
      title,
      titleFormatted: title,
      titlePlaintext: title,
      textTitle: title,
      subtitle,
      subtitleFormatted: subtitle,
      subtitlePlaintext: subtitle,
      name
    };
    if (random(0, 100) > 50) {
      attr.avatarStyles = image();
      attr.coverStyles = image();
      attr.avatarMeta = imageMeta();
    }
    if (random(0, 100) > 75) {
      attr.draft = true;
    }
    return attr;
  });
}

function resources(count = defaultCount) {
  return arrayOf("resourceCollections", count, () => {
    const title = faker.company.catchPhrase();
    const kind = sample([
      "document",
      "image",
      "video",
      "audio",
      "file",
      "link",
      "pdf",
      "spreadsheet",
      "presentation",
      "interactive"
    ]);
    const attr = {
      titleFormatted: title,
      title,
      kind
    };
    if (random(0, 100) > 75) {
      attr.variantThumbnailStyles = image();
    }
    return attr;
  });
}

function resourceCollections(count = defaultCount) {
  return arrayOf("resourceCollections", count, () => {
    const title = faker.company.catchPhrase();
    const collectionResourcesCount = random(0, 100) > 50 ? 0 : random(0, 100);
    const attr = {
      title,
      collectionResourcesCount
    };
    if (random(0, 100) > 75) {
      attr.thumbnailStyles = image();
    }
    return attr;
  });
}

function permissions(count = defaultCount) {
  const availableRoles = [
    "project_editor",
    "project_resource_editor",
    "project_author"
  ];
  return arrayOf("permissions", count, permission => {
    const user = users(1)[0];
    const roles = sampleSize(availableRoles, random(1, 2));
    /* eslint-disable no-param-reassign */
    permission.relationships.user = user;
    permission.attributes.roleNames = roles;
  });
}

function annotations(count = defaultCount, withHighlights = false) {
  const selectionOne = faker.lorem.sentences(5);
  const selectionTwo = faker.lorem.sentences(3);

  return arrayOf("annotations", count, annotation => {
    const user = users(1)[0];
    const project = projects(1)[0];
    annotation.attributes.subject = sample([true, false])
      ? selectionOne
      : selectionTwo;
    annotation.relationships.creator = user;
    annotation.relationships.textSection = project;
    annotation.attributes.body = faker.lorem.sentences(sample([1, 2, 3]));
    if (withHighlights) {
      annotation.attributes.format = sample(["annotation", "highlight"]);
    }
  });
}

function pages(count = defaultCount) {
  return arrayOf("pages", count);
}

export default {
  type: arrayOf,
  users,
  projects,
  contentBlocks,
  makers: users,
  resourceCollections,
  resources,
  permissions,
  readingGroups,
  readingGroupMemberships,
  pages,
  annotations
};
