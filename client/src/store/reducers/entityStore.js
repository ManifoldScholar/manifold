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
    mergedSlugMap[type] = {
      ...stateSlugMap[type],
      ...payloadSlugMap[type]
    };
  });
  return { ...stateSlugMap, ...mergedSlugMap };
}

function mergeEntities(
  stateEntities,
  payloadEntities,
  overwritePartials = false
) {
  const mergedEntities = {};
  Object.keys(payloadEntities).forEach(type => {
    const adjusted = pickBy(payloadEntities[type], (e, uuid) => {
      if (overwritePartials) return true;
      const stateEntity = get(stateEntities, `${type}.${uuid}`);
      if (!stateEntity) return true; // pick it if there's no existing entity
      if (get(e, "meta.partial") === false) return true; // pick it if new entity is not partial
      return get(stateEntity, "meta.partial") === true; // pick it if the state entity is partial
    });
    mergedEntities[type] = { ...stateEntities[type], ...adjusted };
  });
  return { ...stateEntities, ...mergedEntities };
}

function maybeMergeCollections(appendTo, stateResponses, payloadResults) {
  if (!appendTo || !has(stateResponses, appendTo)) return payloadResults;
  return unionWith(
    stateResponses[appendTo].collection,
    payloadResults,
    isEqual
  );
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

function buildMeta(object, baseMeta = {}) {
  const meta = { ...get(object, "meta"), ...baseMeta, relationships: {} };
  const relationships = get(object, "data.relationships") || {};
  Object.keys(relationships).forEach(relationship => {
    if (!relationships[relationship].meta) return null;
    meta.relationships[relationship] = relationships[relationship].meta;
  });

  return meta;
}

function errorResponse(state, action) {
  const meta = action.meta;
  const responses = {
    ...state.responses,
    [meta]: {
      status: action.payload.status,
      statusText: action.payload.statusText,
      errors: get(action.payload, "body.errors"),
      request: get(action, "payload.request"),
      loaded: true
    }
  };
  return { ...state, responses };
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
      newResponses[meta] = { ...response };
    }
  });
  return { ...responses, ...newResponses };
}

function successResponse(state, action) {
  const payload = normalizePayload(action.payload);
  const isNull = !payload;
  const appends = !isNull && action.payload.appends;
  const meta = action.meta;
  const shouldTouchResponses = !isNull && !action.payload.noTouch;
  const overwritePartials = !isNull && action.payload.force;
  const isCollection = !isNull && Array.isArray(payload.results);
  const isEntity = !isNull && !isCollection;
  const baseResponses = shouldTouchResponses
    ? touchResponses(state.responses, payload.entities)
    : state.responses;
  const responses = {
    ...baseResponses,
    [meta]: {
      entity: isEntity ? payload.results : null,
      collection: isCollection
        ? maybeMergeCollections(appends, baseResponses, payload.results)
        : null,
      meta: buildMeta(action.payload, { modified: false }),
      links: get(action.payload, "links"),
      type: !isNull ? deriveType(payload.results) : null,
      request: get(action, "payload.request"),
      loaded: true,
      appends: get(baseResponses[meta], "appends", false)
    }
  };

  if (isNull) {
    return { ...state, responses };
  }
  const entities = responses[meta].appends
    ? Object.assign(
        state.entities,
        mergeEntities(state.entities, payload.entities, overwritePartials)
      )
    : mergeEntities(state.entities, payload.entities, overwritePartials);
  const slugMap = mergeSlugMap(state.slugMap, payload.slugMap);
  return { ...state, responses, entities, slugMap };
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
  const responses = {
    ...state.responses,
    [meta]: {
      entities: null,
      loaded: false,
      appends: action.payload.appends || false
    }
  };
  return { ...state, responses };
}

function handleFlush(state, action) {
  const metasToFlush = action.payload;
  const responses = { ...state.responses };
  metasToFlush.forEach(meta => {
    delete responses[meta];
  });
  let entities = state.entities;
  if (Object.keys(responses).length === 0) {
    entities = {};
  }
  return { ...state, responses, entities };
}

function flushAll(state, actionIgnored) {
  return {
    ...initialState,
    responses: {
      settings: state.responses.settings
    },
    entities: {
      settings: state.entities.settings
    }
  };
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
    const newMeta = buildMeta(response, { modified: true });
    const newResponse = {
      ...response,
      collection: newCollection,
      meta: newMeta
    };
    responsesOverlay[key] = newResponse;
  });
  const responses = { ...state.responses, ...responsesOverlay };
  return { ...state, responses };
}

function handleAdd(state, action) {
  const targetMeta = action.payload.meta;
  const addEntity = action.payload.entity;
  const meta = state.responses[targetMeta];
  if (!meta) return state;
  if (!Array.isArray(meta.collection)) return state;
  if (meta.collection.find(entity => entity.id === addEntity.id)) return state;
  const newCollection = [...meta.collection, addEntity];
  const newMeta = { ...meta, collection: newCollection };
  if (!get(newMeta, "type")) newMeta.type = addEntity.type;
  const responses = { ...state.responses, [targetMeta]: newMeta };
  return { ...state, responses };
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
