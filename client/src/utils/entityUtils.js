import get from 'lodash/get';
import has from 'lodash/has';
import setWith from 'lodash/setWith';

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
    entity = Object.assign({}, source);
    // setWith is like mkdir deep for objects. The "with" part ensures that each segment
    // of the path is an object, rather than an array.
    setWith(hydrationMap, entityPath, entity, Object);
    // Disbaling the linter because it's going to complain about hydrateRelationships
    // being called before it's defined. Nothing we can do about that, since this is a
    // recursive scenario, and the two functions call each other.
    entity.relationships = hydrateRelationships(entity, entities, hydrationMap); // eslint-disable-line
  }
  return entity;
}

function hydrateRelationships(entity, entities, hydrationMap) {
  const relationships = {};
  if (has(entity, 'relationships')) {
    Object.keys(entity.relationships).forEach((key) => {
      const relatedEntities = entity.relationships[key].data;
      if (!relatedEntities) {
        relationships[key] = null;
      } else {
        if (Array.isArray(relatedEntities)) {
          relationships[key] = relatedEntities.map((entityLookup) => {
            return hydrateEntity(entityLookup, entities, hydrationMap);
          });
        } else {
          relationships[key] = hydrateEntity(relatedEntities, entities, hydrationMap);
        }
      }
    });
  }
  return relationships;
}

function selectCollection(response, entities) {
  if (!Array.isArray(response.collection)) return [];
  return response.collection.map((entity) => {
    return hydrateEntity(entity, entities);
  });
}

function selectEntity(response, entities) {
  if (!has(response.entity, 'id')) return null;
  if (!has(response.entity, 'type')) return null;
  return hydrateEntity(response.entity, entities);
}

export function isLoaded(request, state) {
  const loaded = get(state, `entityStore.responses.${request}.loaded`);
  return loaded === true;
}

export function select(requestMeta, entityStore) {
  const response = get(entityStore, `responses.${requestMeta}`);
  if (!response) return null;
  if (response.collection) {
    return selectCollection(response, entityStore.entities);
  }
  return selectEntity(response, entityStore.entities);
}

export function meta(requestMeta, entityStore) {
  const response = get(entityStore, `responses.${requestMeta}`);
  if (!response) return {};
  return response.meta;
}
