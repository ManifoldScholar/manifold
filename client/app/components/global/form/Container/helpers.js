import forEach from "lodash/forEach";
import pick from "lodash/pick";
import isArray from "lodash/isArray";
import isNil from "lodash/isNil";
import isPlainObject from "lodash/isPlainObject";
import isEqual from "lodash/isEqual";
import flatMapDeep from "lodash/flatMapDeep";

// Check if value has an id property (is an entity reference)
function hasIdentity(value) {
  return isPlainObject(value) && value.hasOwnProperty("id");
}

// Check if value looks like a resource (has attributes or relationships)
function isResourcish(value) {
  return (
    isPlainObject(value) &&
    (value.hasOwnProperty("attributes") ||
      value.hasOwnProperty("relationships"))
  );
}

// Make collections comparable by extracting IDs
function makeComparableCollection(collection) {
  return collection.map(entity => {
    if (entity.hasOwnProperty("id")) return entity.id;
    return entity;
  });
}

// Compare two collections by their IDs
function areCollectionsEqualish(a, b) {
  return isEqual(makeComparableCollection(a), makeComparableCollection(b));
}

// Compare two objects, using ID if available
function areObjectsEqualish(a, b) {
  if (hasIdentity(a) && hasIdentity(b)) return a.id === b.id;
  return a === b;
}

// Compare two values with special handling for collections and objects
export function areValuesEqualish(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) return areCollectionsEqualish(a, b);
  if (isPlainObject(a) && isPlainObject(b)) return areObjectsEqualish(a, b);
  if (a === "" && isNil(b)) return true;
  return a === b;
}

// Check if object has keys (shallow)
function hasKeys(obj) {
  if (!isPlainObject(obj)) return false;
  return Object.keys(obj).length > 0;
}

// Check if object has keys (deep)
function hasKeysDeep(obj) {
  if (!isPlainObject(obj)) return false;
  const found = flatMapDeep(obj).find(entry => {
    return Object.keys(entry).length > 0;
  });
  return found !== undefined;
}

// Check if a relationship has changed
function relationshipChanged(a, b) {
  if (Array.isArray(a)) {
    return !areCollectionsEqualish(a, b);
  } else {
    return areObjectsEqualish(a, b);
  }
}

// Check if any relationship has changed
function anyRelationshipChanged(dirty, source) {
  if (
    !isPlainObject(dirty.relationships) ||
    !isPlainObject(source.relationships)
  )
    return false;
  return Object.keys(dirty.relationships).some(relationship => {
    return relationshipChanged(
      dirty.relationships[relationship],
      source.relationships[relationship]
    );
  });
}

// Determine if there are any changes between dirty and source
export function hasChanges(dirty, source) {
  if (isResourcish(dirty)) {
    if (hasKeys(dirty.attributes)) return true;
    return anyRelationshipChanged(dirty, source);
  } else {
    return hasKeysDeep(dirty);
  }
}

// Adjust relationships for JSON:API format
export function adjustRelationships(relationships) {
  if (!relationships) return {};
  const adjusted = { ...relationships };
  forEach(adjusted, (value, key) => {
    if (isNil(value)) {
      adjusted[key] = null;
    } else {
      const adjustedValue = isArray(value)
        ? value.map(relation => pick(relation, ["id", "type", "_remove"]))
        : pick(value, ["id", "type", "_remove"]);
      adjusted[key] = { data: adjustedValue };
    }
  });
  return adjusted;
}
