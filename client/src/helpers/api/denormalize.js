/**
 * Denormalize a JSON:API response.
 * Replaces relationship references with actual entity data from `included`.
 * Preserves `meta` and `links` on the result for pagination.
 *
 * @param {Object} response - API response with { data, included, meta, links }
 * @returns {Array|Object} - Denormalized data with hydrated relationships.
 *                           If data is an array, meta/links are attached as properties.
 */
export default function denormalize(response) {
  if (!response) return [];

  const { data, included = [], meta, links } = response;

  // Build lookup map from included entities
  const entityMap = {};
  included.forEach(entity => {
    const key = `${entity.type}:${entity.id}`;
    entityMap[key] = entity;
  });

  // Hydrate a single entity's relationships
  const hydrateEntity = (entity, visited = new Set()) => {
    if (!entity?.id || !entity?.type) return entity;

    const key = `${entity.type}:${entity.id}`;
    if (visited.has(key)) return entity; // Prevent circular references
    visited.add(key);

    // Get full entity from map if this is just a reference
    const fullEntity = entityMap[key] || entity;

    if (!fullEntity.relationships) return fullEntity;

    const hydratedRelationships = {};
    Object.entries(fullEntity.relationships).forEach(([relName, rel]) => {
      if (!rel?.data) {
        hydratedRelationships[relName] = null;
      } else if (Array.isArray(rel.data)) {
        hydratedRelationships[relName] = rel.data.map(ref => {
          const refKey = `${ref.type}:${ref.id}`;
          const related = entityMap[refKey] || ref;
          return hydrateEntity(related, new Set(visited));
        });
      } else {
        const refKey = `${rel.data.type}:${rel.data.id}`;
        const related = entityMap[refKey] || rel.data;
        hydratedRelationships[relName] = hydrateEntity(
          related,
          new Set(visited)
        );
      }
    });

    return { ...fullEntity, relationships: hydratedRelationships };
  };

  const result = {};

  // Hydrate all entities in data array
  if (Array.isArray(data)) {
    result.data = data.map(entity => hydrateEntity(entity));
  } else {
    result.data = hydrateEntity(data);
  }

  if (meta) result.meta = meta;
  if (links) result.links = links;

  return result;
}
