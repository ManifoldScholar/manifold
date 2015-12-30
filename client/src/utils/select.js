import { isPlainObject } from 'lodash/lang';

export function select(relationships, entities) {
  const selection = {};
  Object.keys(relationships).forEach((key) => {
    const data = relationships[key].data;
    if (Array.isArray(data)) {
      const selected = data.map((entityData) => {
        const id = entityData.id;
        const type = entityData.type;
        if(entities[type] && entities[type][id]) {
          return entities[type][id];
        } else {
          return entityData;
        }
      });
      selection[key] = selected;
    }
    if (isPlainObject(data)) {
      selection[key] = data;
    }
  });
  return selection;
}

