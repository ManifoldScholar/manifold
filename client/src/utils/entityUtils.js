import get from "lodash/get";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import has from "lodash/has";
import setWith from "lodash/setWith";
import memoize from "lodash/memoize";

function hydrateEntity({ id, type }, entities, hydrationMap = {}) {
  const entityPath = `${type}.${id}`;
  const source = get(entities, entityPath);
  let entity;
  if (!source) return { id, type };
  // We need to keep track of which entities we've hydrated to ensure that we don't end
  // up with infinite recursion. For example, a project has many texts, and a text belongs
  // to a project. When we hydrate a text for the project, we'll pick up the text's
  // parent project, and we can end up in an infinite loop. This check ensures that the
  // texts child is a reference to the parent project object, instead of a new object.
  // In other words, we only ever want one instance of an object in the select response.
  if (has(hydrationMap, entityPath)) {
    entity = get(hydrationMap, entityPath);
  } else {
    entity = { ...source };
    // setWith is like mkdir deep for objects. The "with" part ensures that each segment
    // of the path is an object, rather than an array.
    setWith(hydrationMap, entityPath, entity, Object);
    // Disabling the linter because it's going to complain about hydrateRelationships
    // being called before it's defined. Nothing we can do about that, since this is a
    // recursive scenario, and the two functions call each other.
    entity.relationships = hydrateRelationships(entity, entities, hydrationMap); // eslint-disable-line
  }
  return entity;
}

function idOrSlugToId(type, idOrSlug, entityStore) {
  let id = idOrSlug;
  if (entityStore.slugMap[type] && entityStore.slugMap[type][idOrSlug]) {
    id = entityStore.slugMap[type][idOrSlug];
  }
  return id;
}

function hydrateRelationships(entity, entities, hydrationMap) {
  const relationships = {};
  if (has(entity, "relationships")) {
    Object.keys(entity.relationships).forEach(key => {
      const relatedEntities = entity.relationships[key].data;
      if (!relatedEntities) {
        relationships[key] = null;
      } else if (Array.isArray(relatedEntities)) {
        relationships[key] = relatedEntities.map(entityLookup => {
          return hydrateEntity(entityLookup, entities, hydrationMap);
        });
      } else {
        relationships[key] = hydrateEntity(
          relatedEntities,
          entities,
          hydrationMap
        );
      }
    });
  }
  return relationships;
}

const selectCollection = memoize(
  (response, entities) => {
    if (!Array.isArray(response.collection)) return [];
    return response.collection.map(entity => {
      return hydrateEntity(entity, entities);
    });
  },
  (response, entitiesIgnored) => {
    // for collections, if the response object has changed in any way, then we will go ahead
    // and rehydrate the collection. See comment below for why this is more complicated for
    // single models, which we can cache longer.
    return response;
  }
);

const selectEntity = memoize(
  (response, entities) => {
    if (!has(response.entity, "id")) return null;
    if (!has(response.entity, "type")) return null;
    return hydrateEntity(response.entity, entities);
  },
  (response, entities) => {
    // Let's discuss what's happening here. This second function is LoDash's resolver
    // function for memoize. The resolver function returns a value, which is used to
    // determine whether to refresh the memoized value. If the resolver returns a new value
    // since the last time it was called, it will reselect the entity from the store. We
    // don't want to go selecting a new entity every single time the entity store changes,
    // which is why we memoize above. However, if the base entity hasn't changed, we don't
    // want to re-select its associations, etc, which is why check if the main entity
    // is unchanged in the resolver.
    if (!has(response.entity, "id")) return response;
    if (!has(response.entity, "type")) return response;
    const entityPath = `${response.entity.type}.${response.entity.id}`;
    const entity = get(entities, entityPath);
    return entity;
  }
);

// TODO: Refactor this to isRequestLoaded and remove duplicate at line 113 below.
export function isLoaded(request, state) {
  const l = get(state, `entityStore.responses.${request}.loaded`);
  return l === true;
}

export function isEntityLoaded(type, idOrSlug, state) {
  const id = idOrSlugToId(type, idOrSlug, state.entityStore);
  const path = `entityStore.entities.${type}.${id}`;
  const entity = get(state, path);
  if (!isObject(entity)) return false;
  if (get(entity, "meta.partial") === true) return false;
  return true;
}

export function select(requestMeta, entityStore) {
  const response = get(entityStore, `responses.${requestMeta}`);
  if (!response) return null;
  if (response.collection) {
    return selectCollection(response, entityStore.entities);
  }
  return selectEntity(response, entityStore.entities);
}

export function grab(type, idOrSlug, entityStore) {
  const id = idOrSlugToId(type, idOrSlug, entityStore);
  const entityPath = `${type}.${id}`;
  const source = get(entityStore.entities, entityPath);
  if (!source) return null;
  if (get(source, "meta.partial") === true) return null;
  return selectEntity({ entity: { type, id } }, entityStore.entities);
}

export function loaded(requestMeta, entityStore) {
  const response = get(entityStore, `responses.${requestMeta}`);
  if (!response) return false;
  return response.loaded;
}

export function meta(requestMeta, entityStore) {
  const response = get(entityStore, `responses.${requestMeta}`);
  if (!response) return null;
  return response.meta;
}

export function constantizeMeta(metaKey) {
  return `${metaKey.toUpperCase().replace(/-/g, "_")}`;
}

export const entityTypeMap = {
  annotations: "annotation",
  resources: "resource"
};

export function singularEntityName(entity) {
  if (!entity) return null;
  if (!entity.type) return null;
  if (isString(entity.type) && entityTypeMap[entity.type])
    return entityTypeMap[entity.type];
  return entity.type;
}

export default {
  singularEntityName,
  constantizeMeta,
  meta,
  loaded,
  grab,
  select,
  isEntityLoaded,
  isLoaded
};
