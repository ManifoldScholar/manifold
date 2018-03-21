import get from "lodash/get";
import has from "lodash/has";
import pickBy from "lodash/pickBy";
import isArray from "lodash/isArray";
import forEach from "lodash/forEach";
import findIndex from "lodash/findIndex";
import intersection from "lodash/intersection";
import unionWith from "lodash/unionWith";
import isEqual from "lodash/isEqual";

export const initialState = {
  responses: {},
  entities: {},
  slugMap: {}
};

function normalizeCollection(payload) {
  const entities = {};
  const slugMap = {};
  const results = [];
  payload.data.forEach(entity => {
    if (!entities.hasOwnProperty(entity.type)) {
      entities[entity.type] = {};
    }
    if (!slugMap.hasOwnProperty(entity.type)) {
      slugMap[entity.type] = {};
    }
    entities[entity.type][entity.id] = entity;
    if (entity.attributes && entity.attributes.slug) {
      slugMap[entity.type][entity.attributes.slug] = entity.id;
    }
    results.push({ id: entity.id, type: entity.type });
  });
  return { entities, results, slugMap };
}

function normalizeEntity(payload) {
  const entity = payload.data;
  const entities = {
    [entity.type]: {}
  };
  const slugMap = {
    [entity.type]: {}
  };
  const results = { id: entity.id, type: entity.type };
  entities[entity.type][entity.id] = entity;
  if (entity.attributes && entity.attributes.slug) {
    slugMap[entity.type][entity.attributes.slug] = entity.id;
  }
  return { entities, results, slugMap };
}

function normalizePayload(payload) {
  let out;
  if (payload === null) return out;
  if (Array.isArray(payload.data)) {
    out = normalizeCollection(payload);
  } else {
    out = normalizeEntity(payload);
  }
  if (!payload.included) return out;
  payload.included.forEach(entity => {
    if (entity) {
      if (!out.entities.hasOwnProperty(entity.type)) {
        out.entities[entity.type] = {};
      }
      out.entities[entity.type][entity.id] = entity;
    }
  });
  return out;
}

function mergeSlugMap(stateSlugMap, payloadSlugMap) {
  if (!payloadSlugMap) return stateSlugMap;
  const mergedSlugMap = {};
  Object.keys(payloadSlugMap).forEach(type => {
    mergedSlugMap[type] = Object.assign(
      {},
      stateSlugMap[type],
      payloadSlugMap[type]
    );
  });
  return Object.assign({}, stateSlugMap, mergedSlugMap);
}

function mergeEntities(stateEntities, payloadEntities) {
  const mergedEntities = {};
  Object.keys(payloadEntities).forEach(type => {
    const adjusted = pickBy(payloadEntities[type], (e, uuid) => {
      const stateEntity = get(stateEntities, `${type}.${uuid}`);
      if (!stateEntity) return true; // pick it if there's no existing entity
      if (get(e, "meta.partial") === false) return true; // pick it if new entity is not partial
      return get(stateEntity, "meta.partial") === true; // pick it if the state entity is partial
    });
    mergedEntities[type] = Object.assign({}, stateEntities[type], adjusted);
  });
  return Object.assign({}, stateEntities, mergedEntities);
}

function mergeCollections(stateResponse, payloadResults) {
  if (!get(stateResponse, "appends")) return payloadResults;
  return unionWith(stateResponse.collection, payloadResults, isEqual);
}

function deriveType(entityOrCollection) {
  if (has(entityOrCollection, "type")) return entityOrCollection.type;
  if (
    isArray(entityOrCollection) &&
    entityOrCollection.length > 0 &&
    has(entityOrCollection[0], "type")
  ) {
    return entityOrCollection[0].type;
  }
}

function errorResponse(state, action) {
  const meta = action.meta;
  const responses = Object.assign({}, state.responses, {
    [meta]: {
      status: action.payload.status,
      statusText: action.payload.statusText,
      errors: get(action.payload, "body.errors"),
      request: get(action, "payload.request"),
      loaded: true
    }
  });
  return Object.assign({}, state, { responses });
}

function touchResponses(responses, entities) {
  let touched = [];
  const newResponses = {};
  forEach(entities, (groupedEntities, typeIgnored) => {
    touched = touched.concat(Object.keys(groupedEntities));
  });
  forEach(responses, (response, meta) => {
    let responseIds = [];
    if (response.entity) responseIds.push(response.entity.id);
    if (response.collection && response.collection.length > 0) {
      const collectionIds = response.collection.map(e => e.id);
      responseIds = responseIds.concat(collectionIds);
    }
    if (intersection(touched, responseIds).length > 0) {
      newResponses[meta] = Object.assign({}, response);
    }
  });
  return Object.assign({}, responses, newResponses);
}

function successResponse(state, action) {
  const payload = normalizePayload(action.payload);
  const meta = action.meta;
  const isNull = !payload;
  const isCollection = !isNull && Array.isArray(payload.results);
  const isEntity = !isNull && !isCollection;
  const baseResponses = isNull
    ? state.responses
    : touchResponses(state.responses, payload.entities);
  const responses = Object.assign({}, baseResponses, {
    [meta]: {
      entity: isEntity ? payload.results : null,
      collection: isCollection
        ? mergeCollections(baseResponses[meta], payload.results)
        : null,
      meta: Object.assign({}, get(action.payload, "meta"), { modified: false }),
      links: get(action.payload, "links"),
      type: !isNull ? deriveType(payload.results) : null,
      request: get(action, "payload.request"),
      loaded: true,
      appends: get(baseResponses[meta], "appends", false)
    }
  });
  if (isNull) {
    return Object.assign({}, state, { responses });
  }
  const entities = responses[meta].appends
    ? Object.assign(
        state.entities,
        mergeEntities(state.entities, payload.entities)
      )
    : mergeEntities(state.entities, payload.entities);
  const slugMap = mergeSlugMap(state.slugMap, payload.slugMap);
  return Object.assign({}, state, { responses, entities, slugMap });
}

function handleResponse(state, action) {
  const isError = action.error === true;
  return isError
    ? errorResponse(state, action)
    : successResponse(state, action);
}

function handleRequest(state, action) {
  const meta = action.meta;
  if (state.responses[meta]) return state;
  const responses = Object.assign({}, state.responses, {
    [meta]: {
      entities: null,
      loaded: false,
      appends: action.payload.appends || false
    }
  });
  return Object.assign({}, state, { responses });
}

function handleFlush(state, action) {
  const metasToFlush = action.payload;
  const responses = Object.assign({}, state.responses);
  metasToFlush.forEach(meta => {
    delete responses[meta];
  });
  let entities = state.entities;
  if (Object.keys(responses).length === 0) {
    entities = {};
  }
  return Object.assign({}, state, { responses, entities });
}

function flushAll(state, actionIgnored) {
  return Object.assign({}, initialState, {
    responses: {
      settings: state.responses.settings
    },
    entities: {
      settings: state.entities.settings
    }
  });
}

function handleRemove(state, action) {
  const entity = action.payload.entity;
  const { type, id } = entity;
  const responsesOverlay = {};
  forEach(state.responses, (response, key) => {
    if (response.type !== type) return true;
    if (!isArray(response.collection)) return true;
    const index = findIndex(response.collection, e => e.id === id);
    if (index === -1) return true;
    const newCollection = response.collection.slice();
    newCollection.splice(index, 1);
    const newMeta = Object.assign({}, response.meta, { modified: true });
    const newResponse = Object.assign({}, response, {
      collection: newCollection,
      meta: newMeta
    });
    responsesOverlay[key] = newResponse;
  });
  const responses = Object.assign({}, state.responses, responsesOverlay);
  return Object.assign({}, state, { responses });
}

function handleAdd(state, action) {
  const targetMeta = action.payload.meta;
  const addEntity = action.payload.entity;
  const meta = state.responses[targetMeta];
  if (!meta) return state;
  if (!Array.isArray(meta.collection)) return state;
  if (meta.collection.find(entity => entity.id === addEntity.id)) return state;
  const newCollection = [...meta.collection, addEntity];
  const newMeta = Object.assign({}, meta, { collection: newCollection });
  if (!get(newMeta, "type")) newMeta.type = addEntity.type;
  const responses = Object.assign({}, state.responses, {
    [targetMeta]: newMeta
  });
  return Object.assign({}, state, { responses });
}

export default (state = initialState, action) => {
  const type = action.type;
  let newState = state;
  if (type === "ENTITY_STORE_REMOVE") return handleRemove(newState, action);
  if (type === "ENTITY_STORE_ADD") return handleAdd(newState, action);
  if (type === "ENTITY_STORE_FLUSH") return handleFlush(newState, action);
  if (type === "LOGOUT") return flushAll(newState, action);
  if (type.startsWith("API_REQUEST")) return handleRequest(newState, action);
  if (type.startsWith("API_RESPONSE"))
    newState = handleResponse(newState, action);
  return newState;
};
