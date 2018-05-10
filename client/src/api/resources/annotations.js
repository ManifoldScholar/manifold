export default {
  forSection(sectionId, filter = {}, page = {}) {
    const filterParams = Object.assign({}, filter);
    filterParams.orphaned = false;

    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: "GET",
      options: {
        params: { filter: filterParams, page }
      }
    };
  },

  create(sectionId, annotation, notation = null) {
    const data = { attributes: annotation };
    if (notation) {
      data.relationships = {};
      data.relationships[annotation.format] = {
        data: { id: notation.id, type: notation.type }
      };
    }
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "annotation", data })
      }
    };
  },

  update(id, annotation) {
    const data = { attributes: annotation };
    return {
      endpoint: `/api/v1/annotations/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "annotations", data })
      }
    };
  },

  destroy(annotationId) {
    return {
      endpoint: `/api/v1/annotations/${annotationId}`,
      method: "DELETE",
      options: {}
    };
  }
};
