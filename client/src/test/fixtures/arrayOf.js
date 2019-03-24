import entities from "./entity";
import pluralize from "pluralize";
import faker from "faker";
import times from "lodash/times";
import sample from "lodash/sample";
import isPlainObject from "lodash/isPlainObject";
import random from "lodash/random";

const defaultCount = 5;

function image() {
  const value = faker.image.image(100, 100);
  return {
    original: value,
    small: value,
    small_square: value,
    small_landscape: value,
    small_portrait: value,
    medium: value,
    medium_square: value,
    medium_landscape: value,
    medium_portrait: value,
    large_landscape: value
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
    out.push(entity());
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
    return { firstName, lastName, fullName, role };
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
    const attr = {
      title,
      titleFormatted: title,
      titlePlaintext: title,
      subtitle,
      subtitleFormatted: subtitle,
      subtitlePlaintext: subtitle
    };
    if (random(0, 100) > 50) {
      attr.avatarStyles = image();
      attr.coverStyles = image();
      attr.avatarMeta = imageMeta();
    }
    return attr;
  });
}

export default {
  type: arrayOf,
  users,
  projects,
  contentBlocks,
  makers: users
};
