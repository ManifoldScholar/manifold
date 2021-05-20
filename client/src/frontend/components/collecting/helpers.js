import flatMapDepth from "lodash/flatMapDepth";
import identity from "lodash/identity";
import has from "lodash/has";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

export function getEntityCollection(entity, relationship = "collection") {
  return get(entity, `relationships.${relationship}`);
}

function isCollection(possibleCollection) {
  return has(possibleCollection, "attributes.categoryMappings");
}

function hasCollection(possibleEntity, relationship = "collection") {
  return has(possibleEntity, `relationships.${relationship}`);
}

export function collectedIdsForCollection(collection) {
  if (!collection) return [];
  const mappings = collection.attributes.categoryMappings;
  return flatMapDepth(
    Object.values(mappings).map(mapping => Object.values(mapping)),
    identity,
    2
  );
}

export function inCollection(collectionOrEntity, collectable) {
  const collection = isCollection(collectionOrEntity)
    ? collectionOrEntity
    : hasCollection(collectionOrEntity) &&
      getEntityCollection(collectionOrEntity);
  if (!collection) return false;

  const collectedIds = collectedIdsForCollection(collection);
  return collectedIds.includes(collectable.id);
}

export function inCollections(collectable, ...collectionsOrEntities) {
  return collectionsOrEntities.some(collectionOrEntity =>
    inCollection(collectionOrEntity, collectable)
  );
}

export function getResponse(id, responses) {
  return responses.find(res => res.id === id);
}

export function idInResponses(id, responses) {
  if (responses?.length < 1) return false;
  return responses.map(res => res.id).includes(id);
}

export function hasItemsInCollection(entity) {
  const collection = getEntityCollection(entity);
  if (!collection?.attributes) return false;
  return !isEmpty(collection.attributes.categoryMappings);
}
