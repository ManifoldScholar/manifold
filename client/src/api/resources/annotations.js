export default {

  forSection(sectionId) {
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: 'GET',
      options: {
      }
    };
  },

  create(sectionId, annotation, resource = null) {
    const data = { attributes: annotation };
    if (resource) {
      data.relationships = { resource: { data: { id: resource.id, type: "resources" } } };
    }
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "annotation", data })
      }
    };
  },

  destroy(annotationId) {
    return {
      endpoint: `/api/v1/annotations/${annotationId}`,
      method: 'DELETE',
      options: {}
    };
  },

};
