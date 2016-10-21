import isPlainObject from 'lodash/isPlainObject';

export function select(entity, entities) {
  const selection = {};
  if (!entity || !entity.hasOwnProperty('relationships')) return selection;
  const relationships = entity.relationships;
  Object.keys(relationships).forEach((key) => {
    const data = relationships[key].data;
    if (Array.isArray(data)) {
      const selected = data.map((entityData) => {
        const id = entityData.id;
        const type = entityData.type;
        if (entities[type] && entities[type][id]) {
          return entities[type][id];
        }
        return entityData;
      });
      selection[key] = selected;
    }
    if (isPlainObject(data)) {
      const id = data.id;
      const type = data.type;
      if (entities[type] && entities[type][id]) {
        selection[key] = entities[type][id];
      } else {
        selection[key] = data;
      }
    }
  });
  return selection;
}
