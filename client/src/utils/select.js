export function select(relationships, entities) {
  const selection = {};
  Object.keys(relationships).forEach((key) => {
    const selected = relationships[key].data.map((entityData) => {
      const id = entityData.id;
      const type = entityData.type;
      return entities[type][id];
    });
    selection[key] = selected;
  });
  return selection;
}

