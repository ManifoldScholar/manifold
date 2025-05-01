import isString from "lodash/isString";

export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/annotations",
      method: "GET",
      options: {
        params: { filter, page },
      },
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/annotations/${id}`,
      method: "GET",
      options: {},
    };
  },

  forSection(sectionId, textId, filter = {}, page = {}) {
    const filterParams = { ...filter };
    filterParams.orphaned = false;

    return {
      eagerLoad: true,
      endpoint: `/api/v1/texts/${textId}/relationships/text_sections/${sectionId}/annotations`,
      method: "GET",
      options: {
        params: { filter: filterParams, page: { ...page, size: 25 } },
      },
    };
  },

  create(sectionId, annotation, notation = null) {
    const data = { attributes: annotation };
    if (notation) {
      data.relationships = {};
      data.relationships[annotation.format] = {
        data: { id: notation.id, type: notation.type },
      };
    }
    return {
      endpoint: `/api/v1/text_sections/${sectionId}/relationships/annotations`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "annotation", data }),
      },
    };
  },

  update(id, annotation) {
    const data = { attributes: annotation };
    return {
      endpoint: `/api/v1/annotations/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "annotations", data }),
      },
    };
  },

  destroy(annotationId) {
    return {
      endpoint: `/api/v1/annotations/${annotationId}`,
      method: "DELETE",
      options: {},
    };
  },

  flag(annotation, message) {
    const id = isString(annotation) ? annotation : annotation.id;
    return {
      endpoint: `/api/v1/annotations/${id}/relationships/flags`,
      method: "POST",
      options: {
        body: JSON.stringify({ message }),
      },
    };
  },

  unflag(annotation) {
    const id = isString(annotation) ? annotation : annotation.id;
    return {
      endpoint: `/api/v1/annotations/${id}/relationships/flags`,
      method: "DELETE",
      options: {},
    };
  },

  resolveAllFlags(annotationId) {
    return {
      endpoint: `/api/v1/annotations/${annotationId}/relationships/flags/resolve_all`,
      method: "DELETE",
      options: {},
    };
  },
};
