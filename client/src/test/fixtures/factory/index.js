/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint-disable no-param-reassign */

import entities from "../entities";
import has from "lodash/has";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import times from "lodash/times";

function hydrateRelationships(entity) {
  if (!entity.relationships) return entity;
  entity.relationships = Object.entries(entity.relationships).reduce(
    (hydrated, [key, value]) => {
      const type = isArray(value) ? value[0] : value;
      if (!type || !isString(type)) return;
      const related = factory(type, { doNotHydrate: true });
      if (isArray(value)) {
        hydrated[key] = [related];
      } else {
        hydrated[key] = related;
      }
      return hydrated;
    },
    {}
  );
  return entity;
}

export default function factory(
  type,
  { id = null, attributes = {}, relationships = {}, doNotHydrate = false } = {}
) {
  const _factory = entities[type];
  if (!_factory) throw new Error(`Invalid factory: ${type}`);

  const entity = _factory();
  if (!doNotHydrate) hydrateRelationships(entity);

  entity.id = id || "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE";
  entity.attributes = { ...entity.attributes, ...attributes };
  entity.relationships = { ...entity.relationships, ...relationships };
  if (has(entity.attributes, "slug"))
    entity.attributes.slug = `slug-${entity.id}`;

  return entity;
}

function defaultFactoryOptionCreator(type, index) {
  return {
    id: `${type}-${index}`
  };
}

export function collectionFactory(
  type,
  count = 3,
  factoryOptionCreator = defaultFactoryOptionCreator
) {
  return times(count, index =>
    factory(type, factoryOptionCreator(type, index))
  );
}
