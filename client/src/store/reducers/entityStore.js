import get from "lodash/get";
import pickBy from "lodash/pickBy";
import isArray from "lodash/isArray";
import forEach from "lodash/forEach";
import findIndex from "lodash/findIndex";
import update from "immutability-helper";

export const initialState = {
  responses: {},
  entities: {},
  slugMap: {}
};

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

function ensureArray(thing) {
  if (Array.isArray(thing)) return thing;
  return [thing];
}

function isCollection(results) {
  return Array.isArray(results);
}

function isEntity(results) {
  return !isCollection(results);
}

function buildMeta(meta, modified = false) {
  const base = meta || {};
  return update(base, { modified: { $set: modified } });
}

function entitiesToTypedHash(entities, addTo = {}) {
  if (!entities || Object.keys(entities).length === 0) return addTo;
  /* eslint-disable no-param-reassign */
  return ensureArray(entities).reduce((typedHash, entity) => {
    const { type, id } = entity;
    if (!typedHash[type]) typedHash[type] = {};
    typedHash[type][id] = entity;
    return typedHash;
  }, addTo);
  /* eslint-enable no-param-reassign */
}

function typedHashToSlugMap(entities) {
  if (!entities || Object.keys(entities).length === 0) return {};
  /* eslint-disable no-param-reassign */
  return Object.keys(entities).reduce((slugMap, type) => {
    if (!slugMap[type]) slugMap[type] = {};
    slugMap[type] = Object.values(entities[type]).reduce(
      (entityHash, entity) => {
        if (
          !entity ||
          !entity.attributes ||
          !entity.attributes.slug ||
          !entity.id
        )
          return entityHash;
        entityHash[entity.attributes.slug] = entity.id;
        return entityHash;
      },
      {}
    );
    return slugMap;
  }, {});
  /* eslint-enable no-param-reassign */
}

function extractResults(data) {
  if (!data) return null;
  if (!Array.isArray(data) && Object.keys(data).length === 0) return null;
  if (Array.isArray(data)) return data.map(({ id, type }) => ({ id, type }));
  return { id: data.id, type: data.type };
}

function normalizeResponseAction(action) {
  const { payload: actionPayload } = action;
  const payload = actionPayload || {};
  const {
    atomicResults = [],
    included = {},
    data = {},
    meta = {},
    request = {},
    links = {},
    force = false,
    noTouch = false,
    appends = null
  } = payload;
  const options = { appends, force, noTouch };
  const typedIncluded = entitiesToTypedHash(included);

  const adjustedAtomicResults = atomicResults.map(r => r.data);

  const withAtomicUpdates = entitiesToTypedHash(
    adjustedAtomicResults,
    typedIncluded
  );
  const entities = entitiesToTypedHash(data, withAtomicUpdates);
  const results = extractResults(data);
  const slugMap = typedHashToSlugMap(entities);
  const newPayload = {
    entities,
    results,
    slugMap,
    request,
    meta,
    links,
    options
  };
  const updatedPayload = update(action, {
    payload: {
      $set: newPayload
    },
    options: { $set: options }
  });
  return updatedPayload;
}

function typedEntitiesToIdArray(entities) {
  return Object.keys(entities).reduce((ids, type) => {
    return ids.concat(Object.keys(entities[type]));
  }, []);
}

function deriveType(entityOrCollection) {
  if (isEntity(entityOrCollection)) return entityOrCollection.type || null;
  if (isCollection(entityOrCollection) && entityOrCollection.length > 0)
    return entityOrCollection[0].type || null;
  return null;
}

function responseFromPayload(payload, previousResponse) {
  const { results: payloadResults, links, meta, request } = payload;

  const appends =
    payload?.options?.appends &&
    isCollection(payloadResults) &&
    Array.isArray(previousResponse?.collection);
  const results = appends
    ? previousResponse.collection.concat(payloadResults)
    : payloadResults;

  const includedEntityIds = typedEntitiesToIdArray(payload.entities);
  return {
    entity: isEntity(results) ? results : null,
    collection: isCollection(results) ? results : null,
    meta: buildMeta(meta, false),
    links,
    includedEntityIds,
    type: deriveType(results),
    request,
    loaded: true,
    appends: get(previousResponse, "appends", false)
  };
}

function transformStateTouchResponses(state, payload) {
  const { entities, options } = payload;
  if (options.noTouch) return state;
  const entityIds = typedEntitiesToIdArray(entities);
  let newState = state;
  forEach(state.responses, (response, meta) => {
    if (!response.includedEntityIds) return;
    if (
      response.includedEntityIds.some(includedEntityId =>
        entityIds.includes(includedEntityId)
      )
    ) {
      newState = update(newState, {
        responses: { [meta]: { $set: { ...response } } }
      });
    }
  });
  return newState;
}

function transformStateEntities(state, payload) {
  const { entities } = state;
  const { entities: newEntities, options } = payload;
  const forceOverwrite = options.force;

  const mergedEntities = {};
  Object.keys(newEntities).forEach(type => {
    const adjusted = pickBy(newEntities[type], (e, uuid) => {
      if (forceOverwrite) return true;
      const stateEntity = get(entities, `${type}.${uuid}`);
      if (!stateEntity) return true; // pick it if there's no existing entity
      if (get(e, "meta.partial") === false) return true; // pick it if new entity is not partial
      return get(stateEntity, "meta.partial") === true; // pick it if the state entity is partial
    });
    mergedEntities[type] = { ...entities[type], ...adjusted };
  });
  return update(state, {
    entities: { $set: { ...entities, ...mergedEntities } }
  });
}

function transformStateSlugMap(state, payload) {
  const { slugMap } = state;
  const { slugMap: newSlugMap } = payload;
  if (!newSlugMap) return slugMap;
  const mergedSlugMap = {};
  Object.keys(newSlugMap).forEach(type => {
    mergedSlugMap[type] = {
      ...slugMap[type],
      ...newSlugMap[type]
    };
  });
  return update(state, {
    slugMap: { $set: { ...slugMap, ...mergedSlugMap } }
  });
}

function transformStateAddResponse(state, meta, payload) {
  if (!payload.results) return state;
  const response = responseFromPayload(payload, state.responses[meta]);
  return update(state, { responses: { [meta]: { $set: response } } });
}

function successResponse(state, action) {
  const { payload, meta } = normalizeResponseAction(action);

  let newState = state;

  // Add the payload response to the state.
  newState = transformStateAddResponse(newState, meta, payload);

  // Touch all responses that reference response entities.
  newState = transformStateTouchResponses(newState, payload);

  // Merge new entities into the state.
  newState = transformStateEntities(newState, payload);

  // Merge new slugMap entries into the state.
  newState = transformStateSlugMap(newState, payload);

  return newState;
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
    const newMeta = buildMeta(response.meta, true);
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
