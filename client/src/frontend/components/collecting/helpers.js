import flatMapDepth from "lodash/flatMapDepth";
import identity from "lodash/identity";
import has from "lodash/has";
import get from "lodash/get";

export function getEntityCollection(entity, relationship = "collection") {
  return get(entity, `relationships.${relationship}`);
}

export function isCollection(possibleCollection) {
  return has(possibleCollection, "attributes.categoryMappings");
}

export function hasCollection(possibleEntity, relationship = "collection") {
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

export function collectedIdsForCollectionByType(collection) {
  if (!collection) return [];
  const mappings = collection.attributes.categoryMappings;
  return Object.assign({}, ...Object.values(mappings));
}

export function getCollectionCategories(collection) {
  return collection.attributes.categories;
}

export function getMappingsForCollectionCategory(collection, categoryId) {
  return collection.attributes.categoryMappings[categoryId];
}

export function collectionHasUncategorized(collection) {
  const categories = Object.keys(collection.attributes.categoryMappings);
  return categories.includes("$uncategorized$");
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
