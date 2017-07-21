export default {
  forSection(sectionId, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  forMe(filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/me/relationships/annotations`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(sectionId, annotation, resource = null) {
    const data = { attributes: annotation };
    if (resource) {
      data.relationships = {
        resource: { data: { id: resource.id, type: "resources" } }
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
